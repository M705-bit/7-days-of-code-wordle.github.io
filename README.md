# 7-days-of-code-wordle.js-
<p>Este jogo foi inspirado no Wordle. Desenvolvi a página utilizando HTML, dei forma com CSS e a funcionalidade ficou por conta do JavaScript.

Além disso, hospedei o jogo em uma rede local e configirei o arquivo /etc/hosts, que é um arquivo do sistema operacional que converte nomes de host ou nomes de domínio em endereços IP. Dessa forma, era possível acessar o servidor web — implementado com Nginx — simplesmente digitando http://destroyer no navegador, desde que o dispositivo estivesse conectado à mesma rede.

<h3>Como hospedei meu site em um servidor linux: </h3>
Para hospedar um site em um servidor, o primeiro passo é configurar um IP fixo para o servidor, uma vez que, por padrão, o protocolo DHCP atribui endereços IP dinâmicos que podem mudar com frequência.
Para isso eu defini um IP estático em um servidor Ubuntu através do terminal. O Ubuntu utiliza a utility Netplan para fazer configurações de rede.
O Netplan atua como um “renderizador de abstração de configuração de rede”. Isso significa que ele vai fornecer uma camada na qual você pode escrever as suas configurações de rede em um arquivo YAML, e a parte de backend usada para executar essas configurações é abstraída do usuário. O Netplan  vai traduzir essas configurações para um dos renderizadores suportados:
<ul>
<li>Network Manager</li>
<li>systemd-networkd</li>
</ul>
Eu usei o renderizador networkd. O arquivo abaixo está no caminho /etc/netplan. É importante notar que nome do arquivo yaml segue algumas convenções: 
<pre><code>network:
  version: 2
  renderer: networkd
  ethernets:
    enp2s0:
      dhcp4: false
      dhcp6: false
      addresses:
        - ip/mask
      routes:
        - to: default
          via: endereço_ip_de_rota_do_gateway #ex 1.0.0.250
      optional: true
      nameservers:
        addresses:
          #- endereço de dns da rede
          - 127.0.0.1 #ip do localhost
          - 8.8.8.8 # endereço de dns do google
        search:
          - "laboratorio.local"</code></pre>

<h4>Campos do arquivo:<h4>
<ul>
  <li>renderer: O renderizador indica qual a backend do Netplan será usada para aplicar as configurações. </li>
  <li>ethernets: Essa seção especifica que a configuração é para interfaces ethernets. </li>
  <li>routers: Essa seção define as rotas estáticas, a linha “to: default” e “via: ip” especifica que os pacotes devem ser mandados pela rota padrão, via endereço do gateway. </li>
  <li>nameserveres: Esse campo especifica os servidores de DNS a serem usados pelo sistema. Essa seção é muito importante para resolver os nomes de domínio até os respectivos endereços de IP. </li>
  <li>search: No Netplan, o campo search é usado dentro da seção nameservers para definir domínios de busca DNS. Isso permite que você resolva nomes de host incompletos automaticamente com base nesses domínios.</li>
  <li>dhcp4/dhcp6: Nesses campos nós desabilitamos o DHCP para prevenir a designação automática de endereços IP. </li>
</ul>
Após ter criado o arquivo e escrito as configurações você deve tornar o arquivo executável, eu coloquei o código 600, <br />
pois este determina que apenas o usuário root tem permissão de leitura e escrita nesse arquivo. 
<pre><code>$ sudo chmod 600 /etc/netplan/01-netconfig.yaml</code></pre>
Agora você precisa aplicar as mudanças ao netplan: 
<pre><code>sudo netplan apply</code><pre>
<h4>Configurando servidor web:</h4>
<p>Eu usei o nginx como webserver, caso queira usá-lo você precisa ter certeza de que ele está instalado no seu computador.</p>
<p>Para isso execute o seguinte comando:
<pre><code>nginx -v</code></pre>
  
<p>Para configurar um novo site, crie um arquivo de configuração dentro de /etc/nginx/sites-available,</ br>
com as seguintes diretivas:</p>
  
<pre><code>server {
        listen 80;
        server_name destroyer;

        root /var/www/meusite/7-days-of-code-wordle.js-/;
        index index.html;
        location / {
                
                allow endereço_ip;
               
        }

}</code></pre>
<ul>
  <li>listen 80: Define que o servidor escutará requisições na porta 80 (HTTP).</li>
  <li>server_name: Aqui coloque o nome do domínio ou IP do servidor. O meu é destroyer, mas você pode checar isso com o comando dnsdomainname, se não houver resposta você precisará definir um nome de domínio para o seu servidor. </li>
  <li>root:  caminho onde os arquivos do site estão localizados., os meus estão no arquivo /var/www/meusite, nesse diretório eu puxei os arquivos do github com git clone e coloquei o endereço de http que o github oferece para cada respositório, dessa forma eu puxeu o respositório inteiro para esse diretório. </li>
  <li>index: Define o arquivo principal que será carregado. </li>
  <li>location / : em location eu defini quem pode acessar esse webserver.</li>
</ul>
O próximo passo é criar um link simbólico de sites-available para sites-enaibled.
<pre><code>ln -s /etc/nginx/sites-available/meusite /etc/nginx/sites-enabled</code></pre>
Depois teste se suas configurações estão certas com o comando:
<pre><code>nginx -t </code></pre>
Reinicie o nginx:
<pre><code>systemctl restart nginx</code></pre>
Certifique-se de que ele está ativo:
<pre><code>systemctl status nginx</code></pre>
Pronto! Agora qualquer dispositivo que esteja na sua rede pode acessar o seu site através do ip ou através do nome de domínio, basta digitar http://nome_de_domínio_que_vc_configurou e já pode jogar!
