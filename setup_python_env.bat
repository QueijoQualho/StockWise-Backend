@echo off

:: Cria o ambiente virtual
python -m venv python\venv

:: Ativa o ambiente virtual
call python\venv\Scripts\activate

:: Atualiza o pip
pip install --upgrade pip

:: Instala as dependências
pip install -r python\requirements.txt

echo Ambiente virtual configurado e dependências instaladas.
