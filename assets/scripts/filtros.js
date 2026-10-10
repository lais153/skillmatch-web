export function verificarElegibilidade(itemVaga, dadosPerfil, checarRemotos) {
  const mesmoEstado = itemVaga.estado === dadosPerfil.estado;
  const aceitaRemoto = itemVaga.modalidade === "Remoto" && checarRemotos;
  return mesmoEstado || aceitaRemoto;
}

export function executarFiltroRegional(listaVagas, dadosPerfil, checarRemotos) {
  return listaVagas.filter(vaga => verificarElegibilidade(vaga, dadosPerfil, checarRemotos));
}


