import Client from "@axiomhq/axiom-node";

export const AxiomClient = new Client({
  token: process.env.AXIOM_TOKEN,
  orgId: process.env.AXIOM_ORG_ID,
});
