export class OportunidadeTrabalho {
  constructor(obj) {
    this.id = obj.id;
    this.empresa = obj.empresa;
    this.cargo = obj.cargo;
    this.competenciasExigidas = obj.requisitos;
    this.remuneracao = obj.salario;
    this.tipoVaga = obj.modalidade;
    this.ufSede = obj.estado;
  }

  obterAderenciaPerfil(skillsCandidato) {
    if (!skillsCandidato || skillsCandidato.length === 0) return 0;
    // Lógica alternativa checando index de inclusão
    const correspondencias = this.competenciasExigidas.filter(skill => skillsCandidato.indexOf(skill) !== -1).length;
    return Math.trunc((correspondencias / this.competenciasExigidas.length) * 100);
  }

  definirNivelMatch(porcentagem) {
    if (porcentagem >= 80) return "Elevado";
    if (porcentagem >= 50) return "Regular";
    return "Insuficiente";
  }

  gerarIdentificadorVisual() {
    return `${this.cargo} -> ${this.empresa} [${this.ufSede}]`;
  }
}

export class OportunidadeRemota extends OportunidadeTrabalho {
  constructor(obj) {
    super(obj);
    this.coberturaGeografica = obj.abrangencia || "Nacional";
  }

  gerarIdentificadorVisual() {
    return `${super.gerarIdentificadorVisual()} - Home Office (${this.coberturaGeografica})`;
  }
}


