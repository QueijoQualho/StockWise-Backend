import pandas as pd
import json

# Função para limpar os dados dos itens
def clean_data_itens(df):
    df = df.drop(columns=['INVENTÁRIO', 'qnt', 'faltantes'])
    df = df.fillna({'Nº inventário': 0})
    df = df.astype({'Nº inventário': 'int64'})
    df = df.rename(columns={
        'Nº inventário': 'Id',
        'Localização': 'Localizacao',
        'Denominação': 'Denominacao',
        'Incorporação em': 'Incorporacao em'
    })
    df['Incorporacao em'] = pd.to_datetime(df['Incorporacao em']).dt.date
    return df

# Função para limpar os dados das salas
def clean_data_salas(df):
    df = df.rename(columns={
        'numero': 'Localizacao',
        'ambiente': 'Ambiente',
        'Responsável': 'Responsavel'
    })
    df = df.fillna({'Responsavel': "N/A"})
    return df

# Função para processar e agregar os dados
def processar_dados(df_items, df_salas):
    df_resultado = pd.merge(df_items, df_salas, on='Localizacao', how='inner')
    groupLocalizacao = df_resultado.groupby('Localizacao')

    result = {}
    for localizacao, grupo in groupLocalizacao:
        items = grupo[["Id", "Denominacao", "Incorporacao em"]].to_dict("records")
        quantidade_inventario = int(grupo["Id"].count())
        sala = ", ".join(grupo["Ambiente"].unique())

        result[localizacao] = {
            "localizacao": localizacao,
            "quantidade de itens": quantidade_inventario,
            "Sala": sala,
            "items": [
                {
                    "id": item["Id"],
                    "denominacao": item["Denominacao"],
                    "dataDeIncorporacao": item["Incorporacao em"],
                }
                for item in items
            ],
        }
    return result

def main():
    # Carregando os arquivos Excel
    df_items = pd.read_excel('./data/PATRIMONIO 12 2023.xlsx')
    df_salas = pd.read_excel("./data/CÓDIGO AMBIENTE SIG 2023.xlsx")

    # Limpando os dados
    df_items = clean_data_itens(df_items.copy())
    df_salas = clean_data_salas(df_salas.copy())

    # Processando e agregando os dados
    dados = processar_dados(df_items, df_salas)

    # Convertendo os dados para JSON
    return json.dumps(dados, indent=4, default=str)

if __name__ == "__main__":
    main()
