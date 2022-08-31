const $originalFile = document.querySelector("#originalFile");
const $downloas_csv = document.querySelector("#downloas_csv");

function readJson(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function () {
    const json = JSON.parse(this.result);
    callback(json);
  };

  reader.readAsText(file);
  event.preventDefault();
}

$originalFile.addEventListener("input", (event) => {
  const file = event.target.files[0];

  console.log(file.name);

  $downloas_csv.setAttribute("download", file.name.replace(`.json`, ".csv"));

  readJson(file, (json) => {
    // console.log(json);

    const extracaoInfosImportantes = json.reduce(
      (
        acc,
        {
          detalhesCliente: {
            brisa_movel,
            documento,
            data_ativacao,
            data_criacao,
            data_nascimento,
            identidade,
            nome: nome_cliente,
            telefone,
            telefone2,
            telefone3,
          },
          enderecos,
        }
      ) => {
        let data = {
          brisa_movel,
          documento,
          data_ativacao,
          data_criacao,
          data_nascimento,
          identidade,
          nome_cliente,
          telefone,
          telefone2,
          telefone3,
        };

        enderecos.map(
          ({
            bairro,
            cep,
            cidade_nome,
            id: idEndereco,
            latitude,
            longitude,
            logradouro,
            numero,
            ponto_referencia1,
            ponto_referencia2,
            uf,

            cliente: {
              ativo: cliente_ativo,
              brisa_movel,
              classificacao,
              classificacao_valor,
              data_criacao,
              data_nascimento,
              email,
              email2,
              grande_empresa,
            },

            contratos,
          }) => {
            data = {
              ...data,
              bairro,
              cep,
              cidade_nome,
              idEndereco,
              latitude,
              longitude,
              logradouro,
              numero,
              ponto_referencia1,
              ponto_referencia2,
              uf,
              cliente_ativo,
              brisa_movel,
              classificacao,
              classificacao_valor,
              data_criacao,
              data_nascimento,
              email,
              email2,
              grande_empresa,
            };

            contratos.map(
              ({
                ativo: contrato_ativo,
                data_cancelado,
                data_contratacao,
                data_primeira_ativacao,
                id: idContrato,
                pessoa_juridica,
                plano_principal: {
                  categoria_tipo,
                  nome: plano,
                  radio,
                  valor,
                  valor_corporativo,
                },
              }) => {
                data = {
                  ...data,
                  contrato_ativo,
                  data_cancelado,
                  data_contratacao,
                  data_primeira_ativacao,
                  idContrato,
                  pessoa_juridica,
                  categoria_tipo,
                  plano,
                  radio,
                  valor,
                  valor_corporativo,
                };

                let newData = {};

                for (key in data) {
                  const val = data[key];
                  newData = { ...newData, [key]: val || "" };
                }

                console.log(newData)

                acc = [...acc, newData];
              }
            );
          }
        );

        return acc;
      },
      []
    );

    // console.log(extracaoInfosImportantes);

    const header = Object.keys(extracaoInfosImportantes[0]);

    let arr = [header];

    extracaoInfosImportantes.forEach((contrato) => {
      const values = Object.values(contrato);
    //   const header = arr[0];

      arr.push(values);
    });

    const dataFinal = arr.map((linha) => linha.join()).join(`\n`);

    $downloas_csv.setAttribute(
      `href`,
      `data:text/csv;encoding=utf8,${encodeURIComponent(dataFinal)}`
    );

    $downloas_csv.click();

    console.log(dataFinal);
  });
});
