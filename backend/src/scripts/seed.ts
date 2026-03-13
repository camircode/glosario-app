import { db } from "../db";
import { terms } from "../db/schema";

const sampleTerms = [
  {
    name: "Algoritmo",
    definition: "Conjunto de reglas o instrucciones definidas, ordenadas y finitas que permiten realizar una actividad o tarea mediante pasos sucesivos. Los algoritmos son fundamentales en la programación y ciencias de la computación ya que proporcionan la lógica necesaria para resolver problemas computacionales.",
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
  },
  {
    name: "Base de Datos",
    definition: "Colección organizada de información estructurada, o datos, típicamente almacenados electrónicamente en un sistema informático. Las bases de datos permiten almacenar, recuperar, actualizar y eliminar datos de manera eficiente.",
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
  },
  {
    name: "Compilador",
    definition: "Programa informático que traduce código fuente escrito en un lenguaje de programación de alto nivel a un lenguaje de bajo nivel (código máquina o lenguaje ensamblador) que puede ser ejecutado directamente por la computadora.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
  },
  {
    name: "Debugging",
    definition: "Proceso de encontrar y resolver defectos o problemas dentro de un programa de computadora que impiden su correcto funcionamiento. Es una habilidad esencial para todo desarrollador de software.",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
  },
  {
    name: "Encapsulamiento",
    definition: "Principio de la programación orientada a objetos que consiste en ocultar los detalles internos de un objeto y exponer solo la interfaz pública necesaria para interactuar con él. Esto mejora la seguridad y modularidad del código.",
    imageUrl: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800",
  },
  {
    name: "Framework",
    definition: "Plataforma de desarrollo de software que proporciona una base sobre la cual los desarrolladores pueden construir aplicaciones. Incluye bibliotecas, herramientas y convenciones que facilitan y aceleran el desarrollo.",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
  },
  {
    name: "Git",
    definition: "Sistema de control de versiones distribuido que permite a los desarrolladores rastrear cambios en el código fuente durante el desarrollo de software. Facilita la colaboración entre múltiples desarrolladores.",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
  },
  {
    name: "HTTP",
    definition: "Protocolo de Transferencia de Hipertexto (Hypertext Transfer Protocol). Es el protocolo fundamental de la World Wide Web que define cómo se formatean y transmiten los mensajes entre clientes y servidores web.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
  },
];

async function seed() {
  try {
    console.log("Seeding database...");
    
    const existing = await db.query.terms.findMany({
      limit: 1,
    });
    
    if (existing.length > 0) {
      console.log("Database already has data. Skipping seed.");
      process.exit(0);
    }
    
    for (const term of sampleTerms) {
      await db.insert(terms).values(term);
    }
    
    console.log(`Seeded ${sampleTerms.length} terms successfully`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

seed();