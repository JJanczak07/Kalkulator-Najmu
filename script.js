let edytowanyIndex = null;

function policz() {
  let czynsz = Number(document.getElementById("czynsz").value);
  let zaplacono = Number(document.getElementById("zaplacono").value);
  let prad = Number(document.getElementById("prad").value);
  let woda = Number(document.getElementById("woda").value);
  let potracenie = Number(document.getElementById("potracenie").value);

  let wynik = document.getElementById("wynik");

  if (
    document.getElementById("czynsz").value === "" ||
    document.getElementById("zaplacono").value === "" ||
    document.getElementById("prad").value === "" ||
    document.getElementById("woda").value === "" ||
    document.getElementById("potracenie").value === ""
  ) {
    wynik.innerHTML = "Uzupełnij wszystkie pola z kwotami";
    return;
  }

  let naleznosc = czynsz + prad + woda - potracenie;
  let nadplata = zaplacono - naleznosc;

  if (nadplata > 0) {
    wynik.innerHTML = "✅ Nadpłata: " + nadplata + " zł";
  } else if (nadplata < 0) {
    wynik.innerHTML = "❌ Niedopłata: " + Math.abs(nadplata) + " zł";
  } else {
    wynik.innerHTML = "🟢 Rozliczenie idealne";
  }
}

function zapiszCzynsz() {
  let czynsz = document.getElementById("czynsz").value;
  localStorage.setItem("stalyCzynsz", czynsz);
}

let zapisanyCzynsz = localStorage.getItem("stalyCzynsz");

if (zapisanyCzynsz !== null) {
  document.getElementById("czynsz").value = zapisanyCzynsz;
}

function zapiszMiesiac() {
  let miesiac = document.getElementById("miesiac").value;
  let czynsz = Number(document.getElementById("czynsz").value);
  let zaplacono = Number(document.getElementById("zaplacono").value);
  let prad = Number(document.getElementById("prad").value);
  let woda = Number(document.getElementById("woda").value);
  let potracenie = Number(document.getElementById("potracenie").value);
  let opisPotracenia = document.getElementById("opisPotracenia").value;

  if (miesiac === "") {
    document.getElementById("wynik").innerHTML = "Wpisz miesiąc przed zapisaniem";
    return;
  }

  let naleznosc = czynsz + prad + woda - potracenie;
  let nadplata = zaplacono - naleznosc;

  let nowyMiesiac = {
    miesiac: miesiac,
    czynsz: czynsz,
    zaplacono: zaplacono,
    prad: prad,
    woda: woda,
    potracenie: potracenie,
    opisPotracenia: opisPotracenia,
    naleznosc: naleznosc,
    nadplata: nadplata
  };

  let historia = JSON.parse(localStorage.getItem("historiaNajmu")) || [];

  if (edytowanyIndex === null) {
    let istnieje = historia.some(function(element) {
      return element.miesiac.toLowerCase() === miesiac.toLowerCase();
    });

    if (istnieje) {
      document.getElementById("wynik").innerHTML =
        "⚠️ Ten miesiąc jest już zapisany.";
      return;
    }

    historia.push(nowyMiesiac);
  } else {
    historia[edytowanyIndex] = nowyMiesiac;
    edytowanyIndex = null;
  }

  localStorage.setItem("historiaNajmu", JSON.stringify(historia));

  pokazHistorie();

  document.getElementById("wynik").innerHTML =
    "✅ Miesiąc został zapisany.";

  document.getElementById("przyciskZapisu").innerHTML =
    "Zapisz miesiąc";

  document.getElementById("miesiac").value = "";
  document.getElementById("zaplacono").value = "";
  document.getElementById("prad").value = "";
  document.getElementById("woda").value = "";
  document.getElementById("potracenie").value = "";
  document.getElementById("opisPotracenia").value = "";
}

function pokazHistorie() {
  let historia = JSON.parse(localStorage.getItem("historiaNajmu")) || [];
  let saldo = 0;

  historia.forEach(function(miesiac) {
    saldo += miesiac.nadplata;
  });

  let historiaDiv = document.getElementById("historia");
  let saldoDiv = document.getElementById("saldo");

  if (saldo > 0) {
    saldoDiv.innerHTML = "💚 Łączne saldo: +" + saldo + " zł";
  } else if (saldo < 0) {
    saldoDiv.innerHTML = "❤️ Łączne saldo: " + saldo + " zł";
  } else {
    saldoDiv.innerHTML = "🤍 Łączne saldo: 0 zł";
  }

  historiaDiv.innerHTML = "";

  if (historia.length === 0) {
    historiaDiv.innerHTML = "Brak zapisanych miesięcy";
    return;
  }

  historia.slice().reverse().forEach(function(miesiac, index) {
    historiaDiv.innerHTML += `
      <div class="pozycja-historii">
        <strong>📅 ${miesiac.miesiac}</strong><br><br>

        💰 Zapłacono: ${miesiac.zaplacono} zł<br>
        ⚡ Prąd: ${miesiac.prad} zł<br>
        💧 Woda: ${miesiac.woda} zł<br>
        🛠 Potrącenie: ${miesiac.potracenie} zł<br>
        📝 ${miesiac.opisPotracenia}<br><br>

        <strong>${
          miesiac.nadplata >= 0
            ? "✅ Nadpłata"
            : "❌ Niedopłata"
        }: ${Math.abs(miesiac.nadplata)} zł</strong>

        <br><br>

        <button class="secondary" onclick="edytujMiesiac(${historia.length - 1 - index})">Edytuj</button>
        <button class="danger" onclick="usunMiesiac(${historia.length - 1 - index})">Usuń</button>
      </div>
    `;
  });
}
function usunMiesiac(index) {
  let historia = JSON.parse(localStorage.getItem("historiaNajmu")) || [];

  let miesiacDoUsuniecia = historia[index];

  let potwierdzenie = confirm(
    "Czy na pewno chcesz usunąć miesiąc: " + miesiacDoUsuniecia.miesiac + "?"
  );

  if (potwierdzenie === false) {
    return;
  }

  historia.splice(index, 1);

  localStorage.setItem("historiaNajmu", JSON.stringify(historia));

  pokazHistorie();

  document.getElementById("wynik").innerHTML =
    "🗑️ Miesiąc został usunięty.";
}

function edytujMiesiac(index) {
  let historia = JSON.parse(localStorage.getItem("historiaNajmu")) || [];

  let wybranyMiesiac = historia[index];

  edytowanyIndex = index;

  document.getElementById("miesiac").value = wybranyMiesiac.miesiac;
  document.getElementById("czynsz").value = wybranyMiesiac.czynsz;
  document.getElementById("zaplacono").value = wybranyMiesiac.zaplacono;
  document.getElementById("prad").value = wybranyMiesiac.prad;
  document.getElementById("woda").value = wybranyMiesiac.woda;
  document.getElementById("potracenie").value = wybranyMiesiac.potracenie;
  document.getElementById("opisPotracenia").value = wybranyMiesiac.opisPotracenia;

  document.getElementById("wynik").innerHTML =
    "Edytujesz miesiąc. Popraw dane i kliknij Zapisz miesiąc.";

  document.getElementById("przyciskZapisu").innerHTML =
    "💾 Zapisz zmiany";
}
function ustawAktualnyMiesiac() {
  let poleMiesiaca = document.getElementById("miesiac");

  if (poleMiesiaca.value !== "") {
    return;
  }

  let dzisiaj = new Date();

  let miesiace = [
    "Styczeń", "Luty", "Marzec", "Kwiecień",
    "Maj", "Czerwiec", "Lipiec", "Sierpień",
    "Wrzesień", "Październik", "Listopad", "Grudzień"
  ];

  let nazwaMiesiaca = miesiace[dzisiaj.getMonth()];
  let rok = dzisiaj.getFullYear();

  poleMiesiaca.value = nazwaMiesiaca + " " + rok;
}
function eksportujPDF() {

  const { jsPDF } = window.jspdf;

  let pdf = new jsPDF();

  let historia = JSON.parse(localStorage.getItem("historiaNajmu")) || [];

  pdf.setFontSize(20);
  pdf.text("Rozliczenie najmu", 20, 20);

  pdf.setFontSize(11);

  let dzisiaj = new Date();

  pdf.text(
    "Data wygenerowania: " + dzisiaj.toLocaleDateString("pl-PL"),
    20,
    30
  );

  let y = 45;

  historia
    .slice()
    .reverse()
    .forEach(function(miesiac) {

      pdf.setFontSize(14);
      pdf.text(miesiac.miesiac, 20, y);

      y += 8;

      pdf.setFontSize(11);

      pdf.text("Zapłacono: " + miesiac.zaplacono + " zł", 25, y);
      y += 6;

      pdf.text("Prąd: " + miesiac.prad + " zł", 25, y);
      y += 6;

      pdf.text("Woda: " + miesiac.woda + " zł", 25, y);
      y += 6;

      pdf.text("Potrącenie: " + miesiac.potracenie + " zł", 25, y);
      y += 6;

      pdf.text("Opis: " + miesiac.opisPotracenia, 25, y);
      y += 6;

      pdf.text(
        "Saldo miesiąca: " + miesiac.nadplata + " zł",
        25,
        y
      );

      y += 12;

    });

  pdf.save("Rozliczenie najmu.pdf");

}
ustawAktualnyMiesiac();
pokazHistorie();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}