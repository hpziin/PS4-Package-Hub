

\# PS4 Package Hub



Interface web estática para GitHub Pages.



\## Publicação



1\. Crie um repositório chamado PS4-Package-Hub.

2\. Envie os arquivos para a raiz do repositório.

3\. Abra Settings > Pages.

4\. Selecione Deploy from a branch.

5\. Escolha main e /(root).

6\. Salve e aguarde a publicação.



O endereço será:



https://SEU-USUARIO.github.io/PS4-Package-Hub/



\## Comunicação com o PS4



A interface espera que o payload implemente:



\- GET /api/v1/status

\- POST /api/v1/install

\- GET /api/v1/jobs



A porta padrão da interface é 18181.



O payload de diagnóstico atual ainda não implementa esses endpoints.

A comunicação também depende de o navegador do PS4 permitir o acesso

da página HTTPS à rede local HTTP.



