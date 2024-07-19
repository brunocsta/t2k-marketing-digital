const wrapper = document.querySelector(".wrapper");
const carrossel = document.querySelector(".carrousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carrossel.querySelector(".cards").offsetWidth;
const carrosselChildrens = [...carrossel.children];
let isArrastando = false,
	posicaoX,
	posicaoScrollEsquerdo,
	timeOutID;

//Verifica o número de cartões que cabem na tela
let cardPerView = Math.round(carrossel.offsetWidth / firstCardWidth);

const autoplay = () => {
	if (window.innerWidth < 800) return; //sem autoplay no mobile
	//timer do autoplay
	timeOutID = setTimeout(() => (carrossel.scrollLeft += firstCardWidth), 2500);
}

autoplay();

//Insere os últimos cards no começo e os primeiros cards no fim da fila gerando um carrossel infinito
carrosselChildrens
	.slice(-cardPerView)
	.reverse()
	.forEach((card) => {
		carrossel.insertAdjacentHTML("afterbegin", card.outerHTML);
	});

carrosselChildrens.slice(0, cardPerView).forEach((card) => {
	carrossel.insertAdjacentHTML("beforeend", card.outerHTML);
});

//EventListener para adicionar comportamento de scroll nas setas
arrowBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		carrossel.scrollLeft +=
			btn.id === "left" ? -firstCardWidth : firstCardWidth;
	});
});

const arrastarFim = () => {
	isArrastando = false;
	carrossel.classList.remove("arrastando");
}

const arrastarInicio = (e) => {
	isArrastando = true;
	carrossel.classList.add("arrastando");
	//posição inicial do cursos e do scroll
	posicaoX = e.pageX;
	posicaoScrollEsquerdo = carrossel.scrollLeft;
}

const arrastar = (e) => {
	if (!isArrastando) return; //sem movimento de drag retorna aqui a func.
	//atualiza a posição do carrossel com base na posição do cursos e do scroll
	carrossel.scrollLeft = posicaoScrollEsquerdo - (e.pageX - posicaoX); //
}

const scrollInfinito = () => {
	if (carrossel.scrollLeft === 0) {
		carrossel.classList.add("no-transition");
		carrossel.scrollLeft = carrossel.scrollWidth - 2 * carrossel.offsetWidth;
		carrossel.classList.remove("no-transition");
	} else if (
		Math.ceil(carrossel.scrollLeft) ===
		carrossel.scrollWidth - carrossel.offsetWidth
	) {
		carrossel.classList.add("no-transition");
		carrossel.scrollLeft = carrossel.offsetWidth;
		carrossel.classList.remove("no-transition");
	}

   //para o autoplay se o mouse estiver no carrossel
   clearTimeout(timeOutID);
   if(!wrapper.matches(":hover")) autoplay();
}

carrossel.addEventListener("mousedown", arrastarInicio);
carrossel.addEventListener("mousemove", arrastar);
document.addEventListener("mouseup", arrastarFim);
carrossel.addEventListener("scroll", scrollInfinito);
wrapper.addEventListener("mouseenter", () => {clearTimeout(timeOutID)});
wrapper.addEventListener("mouseleave", () => {autoplay()});

