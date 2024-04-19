$(document).ready(function(){
  const memoryQuotes = [
    '"Memory is the diary that we all carry about with us." - Oscar Wilde',
    '"The mind is not a vessel to be filled but a fire to be kindled." - Plutarch',
    '"Nostalgia is a file that removes the rough edges from the good old days." - Doug Larson',
    '"Memory... is the diary that we all carry about with us." - Oscar Wilde',
    '"Our memory is a more perfect world than the universe: it gives back life to those who no longer exist." - Guy de Maupassant'
  ];

  const quoteContainer = document.getElementById('memory-quotes');
  let currentQuoteIndex = 0;

  function showQuote() {
    const quote = document.createElement('div');
    quote.classList.add('quote');
    quote.textContent = memoryQuotes[currentQuoteIndex];
    quoteContainer.innerHTML = ''; 
    quoteContainer.appendChild(quote);

    setTimeout(() => {
      quote.classList.add('quote-active');
    }, 10);

    setTimeout(() => {
      quote.classList.remove('quote-active');

      currentQuoteIndex = (currentQuoteIndex + 1) % memoryQuotes.length;
      showQuote();
    }, 2000);
  }

  showQuote();
});
