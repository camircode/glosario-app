import { auth } from "../lib/auth";
import { db } from "../db";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@glosario.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = "Administrador";

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    console.log("Usuario administrador creado exitosamente");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    if (error.message?.includes("already exists")) {
      console.log("El usuario administrador ya existe");
    } else {
      console.error("Error al crear usuario:", error);
      process.exit(1);
    }
  }

  process.exit(0);
}

createAdmin();