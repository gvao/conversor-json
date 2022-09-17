const $originalFile = document.querySelector("#originalFile");
const ancor = document.querySelector("#downloas_csv");

function readJson(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function () {
    const json = JSON.parse(this.result);
    callback(json);
  };

  reader.readAsText(file);
  event.preventDefault();
}

function JsonForArray(data) {
  let newData = {};

  for (key in data) {
    const val = data[key];
    newData = { ...newData, [key]: val || "" };
  }
  
  return newData
}

function arrayToStringCSV(array) {
  return array
      .map((linha) => linha.join(','))
      .join(`\r\n`);
}

function DownloadCSV(fileName, array) {

  const data = arrayToStringCSV(array)

  const name = fileName.indexOf(`.json`) === -1 
    ? `${fileName}.csv` 
    : fileName.replace(`.json`, ".csv")

  const ancor = document.createElement(`a`)
  ancor.setAttribute("download", name);
  ancor.setAttribute(
    `href`,
    `data:text/csv;encoding=utf8,${encodeURIComponent(data)}`
  );

  ancor.click();
}

function mainDownloadInCsv (fileName, json) {

  const extracaoInfosImportantes = json.reduce(
    (
      acc,
      {
        detalhesCliente: {
          brisa_movel,documento,data_ativacao,data_criacao,identidade,nome: nome_cliente,telefone,telefone2,telefone3,
        },
        enderecos,
      }
    ) => 
    {
      let data = {
        brisa_movel,documento,data_ativacao,data_criacao,identidade,nome_cliente,telefone,telefone2,telefone3,
      };

      enderecos.forEach(function ({
          bairro,cep,cidade_nome,logradouro,numero,uf,

          cliente: {
            ativo: cliente_ativo, brisa_movel, classificacao,classificacao_valor,data_criacao,data_nascimento,email,email2,grande_empresa,
          },

          contratos,
        }) {

          data = {
            ...data,bairro,cep,cidade_nome,logradouro,numero,uf,cliente_ativo,brisa_movel,classificacao,classificacao_valor,data_criacao,data_nascimento,email,email2,grande_empresa,
          };

          contratos.forEach( function ({
              ativo: contrato_ativo,data_cancelado,data_contratacao,data_primeira_ativacao,pessoa_juridica,
              plano_principal: {
                categoria_tipo,nome: plano,radio,valor,valor_corporativo,
              },
            }) {
              data = {
                ...data,contrato_ativo,data_cancelado,data_contratacao,data_primeira_ativacao,pessoa_juridica,categoria_tipo,plano,radio,valor,valor_corporativo,
              };
              const newData = JsonForArray(data)

              acc = [...acc, newData];
            }
          );
        }
      );

      return acc;
    },
    []
  );

  const header = extracaoInfosImportantes.reduce((acc, infos) => {
    const keys = Object.keys(infos)
    const keysFaltantes = keys.filter(key => !acc.includes(key))
    return acc = [ ...acc, ...keysFaltantes ]
  }, [])

  const data = extracaoInfosImportantes.reduce((acc, contrato) => {
    let arr = []
    header.forEach(key => arr.push(contrato[key] || ""))
    return acc = [ ...acc, arr ]
  }, [header]);

  DownloadCSV(fileName, data)

}

$originalFile.addEventListener("input", (event) => {
  const files = event.target.files;

  [...files].forEach((file) => {
    const fileName = file.name

    readJson(file, (json) => {

      
      mainDownloadInCsv(fileName, json)

    });
  });
});
