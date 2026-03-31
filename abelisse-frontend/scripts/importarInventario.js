import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), "inventario.xlsx");

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const categorias = {
    labial: "Labiales",
    lipstick: "Labiales",
    lip: "Labiales",
    delineador: "Delineadores",
    eyeliner: "Delineadores",
    powder: "Polvos Traslúcidos",
    translucent: "Polvos Traslúcidos",
    ultrapink: "Polvos Traslúcidos",
    bronzer: "Bronzer",
    sculpt: "Bronzer",
    blush: "Rubores",
    cheek: "Rubores",
    primer: "Primer",
    serum: "Serums y Cremas",
    cream: "Serums y Cremas",
    cosmetiquera: "Cosmetiqueras",
    bag: "Cosmetiqueras",
    oil: "Aceites Corporales",
    shimmer: "Aceites Corporales",
    pack: "Kits",
    set: "Kits",
    trio: "Kits",
  };

  function detectarCategoria(nombre) {
    const texto = nombre.toLowerCase();
    for (const key in categorias) {
      if (texto.includes(key)) return categorias[key];
    }
    return "Otros";
  }

  for (const row of rows) {
    if (!row["ID de inventario"]) continue;

    const id = row["ID de inventario"];
    const nombre = row["Nombre"] || "Producto sin nombre";
    const marca = row["Marca"] || "";
    const descripcion = row["Descripción"] || "";
    const tamano = row["Tamaño"] || "";
    const stock = Number(row["Cantidad"]) || 0;

    const categoria = detectarCategoria(
      `${nombre} ${descripcion} ${marca}`
    );

    const imagen = `/products/${id}.jpg`;

    await prisma.product.upsert({
      where: { id },
      update: {},
      create: {
        id,
        nombre,
        marca,
        descripcion,
        categoria,
        tamano,
        imagen,
        precio: 0,
        stock,
        stockMinimo: 1,
      },
    });

    console.log(`✔ Insertado: ${id} — ${nombre}`);
  }

  console.log("🎉 Inventario importado correctamente.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
