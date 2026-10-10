import { OportunidadeTrabalho, OportunidadeRemota } from "./motor.js";

export function iniciarPainelRender() {
  let contadorFiltrosAtivos = 0;

  return {
    obterLogsFiltro: () => contadorFiltrosAtivos,
    registrarAcaoFiltro: () => { contadorFiltrosAtivos++; },

    desenharGradeCards(vagas, qualificacoes, boxId) {
      const elementoAlvo = document.getElementById(boxId);
      elementoAlvo.innerHTML = "";

      vagas.forEach(item => {
        const instancia = item.modalidade === "Remoto" 
          ? new OportunidadeRemota(item) 
          : new OportunidadeTrabalho(item);

        const porcentagem = instancia.obterAderenciaPerfil(qualificacoes);
        const rank = instancia.definirNivelMatch(porcentagem);

        const blocoCard = document.createElement("article");
        blocoCard.className = `creative-card match-${rank.toLowerCase()}`;
        blocoCard.setAttribute("tabindex", "0");

        blocoCard.innerHTML = `
          <h3>${instancia.gerarIdentificadorVisual()}</h3>
          <p><strong>Orçamento / Salário:</strong> R$ ${item.salario.toFixed(2)}</p>
          <p><strong>Habilidades Requeridas:</strong> ${instancia.competenciasExigidas.join(", ")}</p>
          <div class="creative-badge">Aderência: ${porcentagem}% (${rank})</div>
        `;
        elementoAlvo.appendChild(blocoCard);
      });
    },

    desenharDestaqueEAnalise(vagas, qualificacoes, destaqueId, panoramaId) {
      const elementoDestaque = document.getElementById(destaqueId);
      const elementoPanorama = document.getElementById(panoramaId);
      
      elementoDestaque.innerHTML = "";
      elementoPanorama.innerHTML = "";

      if (vagas.length === 0) return;

      const arrayCalculado = vagas.map(v => {
        const inst = v.modalidade === "Remoto" ? new OportunidadeRemota(v) : new OportunidadeTrabalho(v);
        return { inst, score: inst.obterAderenciaPerfil(qualificacoes) };
      });

      const melhorOpcao = arrayCalculado.reduce((prev, current) => current.score > prev.score ? current : prev, arrayCalculado);
      const mediaGeral = arrayCalculado.reduce((sum, item) => sum + item.score, 0) / arrayCalculado.length;

      const skillsFaltantes = melhorOpcao.inst.competenciasExigidas.filter(s => !qualificacoes.includes(s));
      const textoDica = skillsFaltantes.length > 0 
        ? `Aprimore o seu portfólio estudando os seguintes tópicos pendentes: <strong>${skillsFaltantes.join(", ")}</strong>.`
        : "Seu portfólio atende 100% dos requisitos exigidos para esta vaga corporativa!";

      elementoDestaque.innerHTML = `
        <article class="designer-destaque-box">
          <h3>💎 Recomendação de Carreira Premium</h3>
          <h4>${melhorOpcao.inst.gerarIdentificadorVisual()}</h4>
          <p>Sua compatibilidade técnica: <strong>${melhorOpcao.score}%</strong></p>
          <p class="designer-hint">${textoDica}</p>
        </article>
      `;

      elementoPanorama.innerHTML = `
        <div class="designer-panorama-box">
          <p>Média de aderência criativa da região: <strong>${mediaGeral.toFixed(1)}%</strong></p>
          <p>Total de projetos elegíveis mapeados: <strong>${vagas.length}</strong></p>
        </div>
      `;
    },

    desenharAvisoStatus(boxId, msg, contextClass = "info") {
      document.getElementById(boxId).innerHTML = `
        <div class="designer-status-alert status-${contextClass}" aria-live="assertive">
          <p>${msg}</p>
        </div>
      `;
    }
  };
}


