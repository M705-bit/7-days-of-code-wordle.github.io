#!/bin/bash
> arquivo_novo.txt
for i in {a..z}; do 
	awk -v letra="$i" 'substr($1,1,1) == letra { print $0 }' palavras.txt \
		| iconv -f UTF-8 -t ASCII//TRANSLIT \
		| sed 's/ç/c/g' >> arquivo_novo.txt
done 


awk '{ palavras[NR] = $0 } END { printf("const palavras = ["); for (i = 1; i <= NR; i++) { printf("\"%s\"", palavras[i]); if (i < NR){ printf(", ")}; } print "];\n\nexport default palavras;"}' arquivo_novo.txt > saida.js

