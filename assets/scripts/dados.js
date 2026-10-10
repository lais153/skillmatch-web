export async function obterDadosServidor() {
  const res = await fetch("./assets/dados/vagas.json");
  if (!res.ok) throw new Error("Erro de conexão com a base de dados de design.");
  return await res.json();
}

export const persistirSessao = (perfil) => localStorage.setItem("skillmatch_design_perf", JSON.stringify(perfil));
export const recuperarSessao = () => JSON.parse(localStorage.getItem("skillmatch_design_perf"));


