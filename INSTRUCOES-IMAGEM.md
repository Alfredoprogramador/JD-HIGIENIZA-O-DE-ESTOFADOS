# 📸 INSTRUÇÕES PARA ADICIONAR A IMAGEM DO HERO

## Passo a Passo:

### 1️⃣ Salvar a Imagem
1. Salve a imagem do sofá que você forneceu
2. Renomeie o arquivo para: **hero-sofa.jpg**
3. Certifique-se que está em formato JPG ou JPEG

### 2️⃣ Copiar para a Pasta Correta
1. Abra a pasta do projeto: `DAVID CLEAM`
2. Navegue até a pasta: `images`
3. Cole o arquivo **hero-sofa.jpg** dentro desta pasta

### 3️⃣ Estrutura Final
```
DAVID CLEAM/
├── images/
│   ├── hero-sofa.jpg  ← SUA IMAGEM AQUI
│   └── README.txt
├── css/
├── js/
└── index.html
```

### 4️⃣ Verificar
1. Abra o arquivo `index.html` no navegador
2. A imagem deve aparecer no fundo do hero section
3. O texto ficará sobreposto com efeito de transparência

---

## ⚠️ IMPORTANTE:

- **Nome do arquivo DEVE ser exatamente:** `hero-sofa.jpg`
- Se o arquivo tiver outro nome, o site não encontrará a imagem
- Use minúsculas e o hífen exatamente como mostrado

---

## 🎨 Alternativa: Usar URL Externa

Se preferir usar a imagem de uma URL (ex: hospedada online):

1. Abra o arquivo: `css/style.css`
2. Encontre a linha (aproximadamente linha 96):
   ```css
   background: linear-gradient(...),
               url('../images/hero-sofa.jpg');
   ```
3. Substitua por:
   ```css
   background: linear-gradient(...),
               url('SUA_URL_AQUI');
   ```

---

## ✨ Efeitos Aplicados:

✅ Overlay transparente bege/marrom sobre a imagem
✅ Parallax effect (imagem se move no scroll)
✅ Partículas flutuantes
✅ Brilho animado
✅ Animação de fade-in ao carregar
✅ Texto sempre legível sobre a imagem

---

## 📞 Lembre-se:

Após adicionar a imagem, faça:
```bash
git add images/hero-sofa.jpg
git commit -m "Adicionar imagem hero do sofá"
git push origin main
```

Pronto! Seu site ficará com a aparência profissional da imagem fornecida! 🚀
