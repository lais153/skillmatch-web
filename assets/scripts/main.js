import { obterDadosServidor, persistirSessao, recuperarSessao } from "./dados.js";
import { executarFiltroRegional } from "./filtros.js";
import { iniciarPainelRender } from "./ui.js";

const visualEngine = iniciarPainelRender();
let cacheVagasLocais = [];

async function startCreativeApp() {
  const formulario = document.getElementById("form-criativo");
  const alternarRemotos = document.getElementById("check-remoto");
  const listaCardsId = "grade-oportunidades";

  visualEngine.desenharAvisoStatus(listaCardsId, "Sincronizando oportunidades criativas...", "loading");

  try {
    cacheVagasLocais = await obterDadosServidor();
    
    const sessaoSalva = recuperarSessao();
    if (sessaoSalva) {
      document.getElementById("nome-candidato").value = sessaoSalva.nome;
      document.getElementById("select-estado").value = sessaoSalva.estado;
      document.getElementById("tempo-portfolio").value = sessaoSalva.experiencia;
      
      sessaoSalva.habilidades.forEach(skill => {
        const inputCheck = document.querySelector(`input[value="${skill}"]`);
        if (inputCheck) inputCheck.checked = true;
      });
      
      atualizarFluxoCriativo();
    } else {
      visualEngine.desenharAvisoStatus(listaCardsId, "Preencha suas qualificações de design para exibir as vagas.", "info");
    }
  } catch (err) {
    visualEngine.desenharAvisoStatus(listaCardsId, `Erro operacional: ${err.message}`, "error");
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    visualEngine.registrarAcaoFiltro();
    atualizarFluxoCriativo();
  });

  alternarRemotos.addEventListener("change", () => {
    if (recuperarSessao()) atualizarFluxoCriativo();
  });
}

function atualizarFluxoCriativo() {
  const nome = document.getElementById("nome-candidato").value.trim();
  const estado = document.getElementById("select-estado").value;
  const experiencia = parseInt(document.getElementById("tempo-portfolio").value, 10) || 0;
  const checarRemotos = document.getElementById("check-remoto").checked;

  const habilidades = Array.from(document.querySelectorAll("input[name='skill']:checked"))
    .map(el => el.value);

  const dadosPerfil = { nome, estado, experiencia, habilidades };
  persistirSessao(dadosPerfil);

  const vagasFiltradas = executarFiltroRegional(cacheVagasLocais, dadosPerfil, checarRemotos);

  if (vagasFiltradas.length === 0) {
    visualEngine.desenharAvisoStatus("grade-oportunidades", "Nenhuma oportunidade disponível para esta região no momento.", "empty");
    document.getElementById("bloco-premium").innerHTML = "";
    document.getElementById("panorama-designer").innerHTML = "";
  } else {
    visualEngine.desenharGradeCards(vagasFiltradas, habilidades, "grade-oportunidades");
    visualEngine.desenharDestaqueEAnalise(vagasFiltradas, habilidades, "bloco-premium", "panorama-designer");
  }
}

document.addEventListener("DOMContentLoaded", startCreativeApp);


