import json
import requests
import os

current_dir = os.path.dirname(os.path.abspath(__file__))

def enviar_dados_para_api(key, data):
    url = f'http://localhost:3000/api/salas/seed'
    payload = {key: data}
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 201:
            print(f'Dados para a sala {key} enviados com sucesso.')
        else:
            print(f'Falha ao enviar dados para a sala {key}. Status code: {response.status_code}')
            print(response.json())
    except Exception as e:
        print(f'Erro ao enviar dados para a sala {key}: {e}')

def main():
    with open(os.path.join(current_dir, 'data.json'), 'r', encoding='utf-8') as file:
      dados = json.load(file)

    for sala_id, dados_sala in dados.items():
        enviar_dados_para_api(sala_id, dados_sala)

if __name__ == "__main__":
    main()
