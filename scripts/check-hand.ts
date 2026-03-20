import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const hand = await p.region.findUnique({
    where: { slug: "hand" },
    include: {
      joints: {
        include: {
          movements: {
            include: { muscles: { include: { muscle: true } } } },
        },
      },
    },
  });
  console.log("Hand region joints:");
  for (const j of hand!.joints) {
    console.log("  " + j.name + " (" + j.slug + ") - " + j.jointType);
    for (const m of j.movements) {
      const roles = m.muscles.map((mm) => mm.muscle.name + " (" + mm.role + ")").join(", ");
      console.log("    " + m.name + " → " + roles);
    }
  }
  await p.$disconnect();
}
main();
