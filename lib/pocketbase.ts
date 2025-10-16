import PocketBase from "pocketbase";

class PocketBaseService {
  private static instance: PocketBase;
  private static url =
    process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

  public static getInstance(): PocketBase {
    if (!PocketBaseService.instance) {
      PocketBaseService.instance = new PocketBase(PocketBaseService.url);

      // Persistencia de autenticación - COMPATIBLE CON VERSIONES ANTERIORES
      PocketBaseService.instance.authStore.onChange(() => {
        if (typeof window !== "undefined") {
          const authData = {
            token: PocketBaseService.instance.authStore.token,
            model: PocketBaseService.instance.authStore.model,
          };
          localStorage.setItem("pocketbase_auth", JSON.stringify(authData));
        }
      });

      // Recuperar autenticación al inicializar - COMPATIBLE CON VERSIONES ANTERIORES
      if (typeof window !== "undefined") {
        const savedAuth = localStorage.getItem("pocketbase_auth");
        if (savedAuth) {
          try {
            const { token, model } = JSON.parse(savedAuth);
            if (token && model) {
              PocketBaseService.instance.authStore.save(token, model);
            }
          } catch (error) {
            console.error("Error loading saved auth:", error);
            localStorage.removeItem("pocketbase_auth");
          }
        }
      }
    }
    return PocketBaseService.instance;
  }

  // Método para autenticación con username/phone - OPTIMIZADO
  public static async login(username: string, password: string) {
    const pb = this.getInstance();

    try {
      // Buscar usuario por username O teléfono en una sola consulta
      const user = await pb
        .collection("users")
        .getFirstListItem(`username="${username}" || phone="${username}"`);

      return await pb
        .collection("users")
        .authWithPassword(user.email, password);
    } catch (error) {
      throw new Error("Usuario o contraseña incorrectos");
    }
  }

  // Método para registro - SIMPLIFICADO y CORREGIDO
  public static async register(
    username: string,
    phone: string,
    password: string
  ) {
    const pb = this.getInstance();

    try {
      // Generar email único
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const tempEmail = `${username
        .toLowerCase()
        .replace(/\s+/g, "")}_@pizzeriaimperial.com`;

      // Datos mínimos y correctos para PocketBase
      const data = {
        username: username,
        email: tempEmail,
        emailVisibility: true,
        password: password,
        passwordConfirm: password,
        phone: phone,
        name: username, // Campo opcional pero útil
      };

      console.log("Intentando crear usuario con datos:", data);

      // Crear el usuario directamente
      const result = await pb.collection("users").create(data);

      // Autenticar después del registro exitoso
      await pb.collection("users").authWithPassword(tempEmail, password);

      return result;
    } catch (error: any) {
      console.error("Error completo del registro:", error);

      // Proporcionar mensajes de error más detallados
      if (error.data && error.data.data) {
        const fieldErrors = error.data.data;
        if (fieldErrors.username) {
          throw new Error(`Nombre de usuario: ${fieldErrors.username.message}`);
        }
        if (fieldErrors.email) {
          throw new Error(`Email: ${fieldErrors.email.message}`);
        }
        if (fieldErrors.phone) {
          throw new Error(`Teléfono: ${fieldErrors.phone.message}`);
        }
        if (fieldErrors.password) {
          throw new Error(`Contraseña: ${fieldErrors.password.message}`);
        }
      }

      throw new Error(
        error.message ||
          "Error al crear la cuenta. Por favor verifica los datos."
      );
    }
  }

  // Resto de los métodos permanecen igual...
  public static logout() {
    const pb = this.getInstance();
    pb.authStore.clear();
    if (typeof window !== "undefined") {
      localStorage.removeItem("pocketbase_auth");
    }
  }

  public static isAuthenticated(): boolean {
    const pb = this.getInstance();
    return pb.authStore.isValid;
  }

  public static getCurrentUser() {
    const pb = this.getInstance();
    return pb.authStore.model;
  }

  public static async updateProfile(
    userId: string,
    data: {
      username?: string;
      phone?: string;
      location?: string;
      points?: number;
    }
  ) {
    const pb = this.getInstance();
    return await pb.collection("users").update(userId, data);
  }

  public static async createOrder(orderData: {
    user: string;
    items: any[];
    total: number;
    status: string;
    points_earned: number;
  }) {
    const pb = this.getInstance();
    return await pb.collection("orders").create(orderData);
  }

  public static async getUserOrders(userId: string) {
    const pb = this.getInstance();
    try {
      return await pb.collection("orders").getFullList({
        filter: `user = "${userId}"`,
        sort: "-created",
      });
    } catch (error) {
      console.error("Error getting user orders:", error);
      return [];
    }
  }

  public static async getUsers() {
    const pb = this.getInstance();
    return await pb.collection("users").getFullList();
  }
}

export default PocketBaseService;
