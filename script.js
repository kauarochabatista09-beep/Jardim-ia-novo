async function enviarImagem(){
  const input=document.getElementById('file');
  const fd=new FormData();
  fd.append('imagem',input.files[0]);
  const r=await fetch('/api/analisar',{method:'POST',body:fd});
  const d=await r.json();
  document.getElementById('resultado').innerHTML=`<h3>Problema</h3><p>${d.problema}</p><h3>Solução</h3><p>${d.solucao}</p>`;
}
