import pandas as pd
import json
import sys
import os

# Função para limpar os dados dos itens
def clean_data_itens(df):
    df = df.drop(columns=['INVENTÁRIO', 'qnt', 'faltantes'], errors='ignore')
    df = df.fillna({'Nº inventário': 0})
    df = df.astype({'Nº inventário': 'int64'})
    df = df.rename(columns={
        'Nº inventário': 'Id',
        'Localização': 'Localizacao',
        'Denominação': 'Denominacao',
        'Incorporação em': 'Incorporacao em'
    })
    df['Incorporacao em'] = pd.to_datetime(df['Incorporacao em'], errors='coerce').dt.date
    return df

# Função para processar os dados
def processar_dados(df_items):
    groupLocalizacao = df_items.groupby('Localizacao')

    result = {}
    for localizacao, grupo in groupLocalizacao:
        items = grupo[["Id", "Denominacao", "Incorporacao em"]].to_dict("records")

        result[localizacao] = {
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
    # Verifica se o caminho do arquivo foi passado como argumento
    if len(sys.argv) < 2:
        print("Erro: Nenhum arquivo especificado.")
        sys.exit(1)

    file_path = sys.argv[1]

    # Determina se o arquivo é CSV ou XLSX
    file_extension = os.path.splitext(file_path)[1].lower()
    if file_extension == '.xlsx':
        df_items = pd.read_excel(file_path)
    elif file_extension == '.csv':
        df_items = pd.read_csv(file_path)
    else:
        print("Erro: Tipo de arquivo não suportado. Use .xlsx ou .csv")
        sys.exit(1)

    # Limpa os dados
    df_items = clean_data_itens(df_items.copy())

    # Processa os dados
    dados = processar_dados(df_items)

    # Converte os dados para JSON e imprime
    jsonPrint = json.dumps(dados, indent=4, default=str)
    print(jsonPrint)

if __name__ == "__main__":
    main()
