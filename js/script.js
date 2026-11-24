(function($) {

  "use strict";

  var initPreloader = function() {
    $(document).ready(function($) {
    var Body = $('body');
        Body.addClass('preloader-site');
    });
    $(window).load(function() {
        $('.preloader-wrapper').fadeOut();
        $('body').removeClass('preloader-site');
    });
  }

  // init Chocolat light box
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}

  var initSwiper = function() {

    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    var promoCarousel = document.querySelector(".qaf-promo-carousel");
    var promoDashboard = document.querySelector(".dashboard-welcome .card-body");
    var promoShell = promoCarousel && promoCarousel.closest(".qaf-promo-shell");
    var promoSource = promoShell && promoShell.closest(".qaf-promo-source");
    if (promoDashboard && promoShell) {
      promoDashboard.appendChild(promoShell);
      if (promoSource) {
        promoSource.remove();
      }
    }

    if (promoCarousel) {
      var prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var promoPhotoPreloads = Object.create(null);
      var preloadNextPromoPhoto = function(swiperInstance) {
        var activeSlide = swiperInstance.el.querySelector(".swiper-slide-active");
        var nextSlide = activeSlide && activeSlide.nextElementSibling;
        var nextImage = nextSlide && nextSlide.querySelector(".qaf-promo-art img[data-promo-image]");
        var imagePath = nextImage && nextImage.getAttribute("data-promo-image");
        if (!imagePath || promoPhotoPreloads[imagePath]) {
          return;
        }

        var preloadImage = new Image();
        promoPhotoPreloads[imagePath] = preloadImage;
        preloadImage.src = imagePath;
      };
      var setActivePromoPhoto = function(swiperInstance) {
        var activeSlide = swiperInstance.el.querySelector(".swiper-slide-active");
        var image = activeSlide && activeSlide.querySelector(".qaf-promo-art img");
        if (!image) {
          return;
        }

        var imagePath = image.getAttribute("data-promo-image");
        if (!imagePath || image.dataset.qafSource === imagePath) {
          preloadNextPromoPhoto(swiperInstance);
          return;
        }

        var artSlot = image.parentNode;
        image.dataset.qafSource = imagePath;
        image.hidden = true;
        artSlot.classList.add("is-placeholder");
        image.onload = function() {
          if (image.dataset.qafSource === imagePath) {
            image.hidden = false;
            artSlot.classList.remove("is-placeholder");
          }
          preloadNextPromoPhoto(swiperInstance);
        };
        image.onerror = function() {
          if (image.dataset.qafSource === imagePath) {
            image.hidden = true;
            artSlot.classList.add("is-placeholder");
          }
          preloadNextPromoPhoto(swiperInstance);
        };
        image.src = imagePath;
      };

      var promoSwiper = new Swiper(promoCarousel, {
        effect: "slide",
        loop: true,
        speed: prefersReducedMotion ? 0 : 400,
        autoHeight: true,
        observer: true,
        observeParents: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".qaf-promo-pagination",
          type: "fraction",
          renderFraction: function(currentClass, totalClass) {
            return '<span class="' + currentClass + '"></span>/<span class="' + totalClass + '"></span>';
          },
          formatFractionCurrent: function(number) {
            return number;
          },
          formatFractionTotal: function(number) {
            return number;
          },
        },
        navigation: {
          nextEl: ".qaf-promo-next",
          prevEl: ".qaf-promo-prev",
        },
        on: {
          slideChange: setActivePromoPhoto,
        },
        a11y: {
          prevSlideMessage: "Promo sebelumnya",
          nextSlideMessage: "Promo berikutnya",
          paginationBulletMessage: "Ke promo {{index}}",
        },
      });
      setActivePromoPhoto(promoSwiper);

      var promoToggle = document.querySelector(".qaf-promo-toggle");
      if (promoToggle) {
        promoToggle.addEventListener("click", function() {
          if (promoSwiper.autoplay.running) {
            promoSwiper.autoplay.stop();
            promoToggle.textContent = "▶";
            promoToggle.setAttribute("aria-label", "Lanjutkan pergantian promo");
          } else {
            promoSwiper.autoplay.start();
            promoToggle.textContent = "Ⅱ";
            promoToggle.setAttribute("aria-label", "Jeda pergantian promo");
          }
        });
      }
    }

    if (document.querySelector(".category-carousel")) {
      new Swiper(".category-carousel", {
        slidesPerView: 8,
        spaceBetween: 30,
        speed: 500,
        navigation: {
          nextEl: ".category-carousel-next",
          prevEl: ".category-carousel-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          991: {
            slidesPerView: 5,
          },
          1500: {
            slidesPerView: 8,
          },
        }
      });
    }

    // Carousel dummy template dihapus; katalog Qaf memakai render produknya sendiri.
    // product single page
    var thumb_slider = new Swiper(".product-thumbnail-slider", {
      slidesPerView: 5,
      spaceBetween: 20,
      // autoplay: true,
      direction: "vertical",
      breakpoints: {
        0: {
          direction: "horizontal"
        },
        992: {
          direction: "vertical"
        },
      },
    });

    var large_slider = new Swiper(".product-large-slider", {
      slidesPerView: 1,
      // autoplay: true,
      spaceBetween: 0,
      effect: 'fade',
      thumbs: {
        swiper: thumb_slider,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // input spinner
  var initProductQty = function(){

    $('.product-qty').each(function(){
      
      var $el_product = $(this);
      var quantity = 0;
      
      $el_product.find('.quantity-right-plus').click(function(e){
        e.preventDefault();
        quantity = parseInt($el_product.find('#quantity').val());
        $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e){
        e.preventDefault();
        quantity = parseInt($el_product.find('#quantity').val());
        if(quantity>0){
          $el_product.find('#quantity').val(quantity - 1);
        }
      });

    });

  }

  // init jarallax parallax
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }

  var initHeroTitle = function() {
    var heroTitle = document.querySelector("#hero-title-text");
    if (!heroTitle || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    var text = heroTitle.textContent.trim();
    var characterIndex = 0;
    heroTitle.textContent = "";

    var typingInterval = window.setInterval(function() {
      heroTitle.textContent = text.slice(0, characterIndex + 1);
      characterIndex += 1;

      if (characterIndex >= text.length) {
        window.clearInterval(typingInterval);
      }
    }, 75);
  }

  var initPageIntro = function() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    var introElements = document.querySelectorAll(
      "header .header-brand, header #navbarLoginButton, header .header-utilities, " +
      ".hero-section .hero-tagline, .hero-section .row.my-5 > .col, " +
      ".hero-feature-grid > .col, .qaf-ticker"
    );

    introElements.forEach(function(element, index) {
      element.style.animationDelay = (index * 90) + "ms";
      element.classList.add("qaf-page-intro");
    });
  }

  var initQafTicker = function() {
    var ticker = document.querySelector(".qaf-ticker");
    var track = ticker && ticker.querySelector(".qaf-ticker-track");
    var messages = track && track.querySelectorAll(".qaf-ticker-message");

    if (!ticker || !track || !messages || messages.length < 2 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    var offset = 0;
    var cycleWidth = messages[0].getBoundingClientRect().width;
    var previousTime = 0;
    var paused = false;
    var hovered = false;
    var focused = false;
    var updatePausedState = function() {
      paused = hovered || focused;
      if (!paused) {
        previousTime = 0;
      }
    };

    // Move one message width then loop seamlessly.
    var animate = function(timestamp) {
      if (!previousTime) {
        previousTime = timestamp;
      }

      var elapsed = Math.min((timestamp - previousTime) / 1000, 0.05);
      previousTime = timestamp;

      if (!paused && cycleWidth > 0) {
        offset = (offset + elapsed * 35) % cycleWidth;
        track.style.transform = "translate3d(-" + offset + "px, 0, 0)";
      }

      window.requestAnimationFrame(animate);
    };

    ticker.addEventListener("mouseenter", function() {
      hovered = true;
      updatePausedState();
    });

    ticker.addEventListener("mouseleave", function() {
      hovered = false;
      updatePausedState();
    });

    ticker.addEventListener("focusin", function() {
      focused = true;
      updatePausedState();
    });

    ticker.addEventListener("focusout", function(event) {
      if (!ticker.contains(event.relatedTarget)) {
        focused = false;
        updatePausedState();
      }
    });

    window.addEventListener("resize", function() {
      cycleWidth = messages[0].getBoundingClientRect().width;
      offset = cycleWidth > 0 ? offset % cycleWidth : 0;
    });

    window.requestAnimationFrame(animate);
  }

  var initCatalog = function() {
    var filterContainer = document.getElementById("catalog-category-filters");
    var contentContainer = document.getElementById("catalog-category-content");
    if (!filterContainer || !contentContainer) {
      return;
    }

    // Path product-thumb generik dibuat menjadi placeholder unik; ganti image untuk memakai foto asli.
    var productsByCategory = {
      "makanan-berat": [
        { id: "ayam-geprek", name: "Ayam Geprek", price: 15000, image: "images/Ayam_geprek.png" },
        { id: "bakso", name: "Bakso", price: 12000, image: "images/bakso.jpg" },
        { id: "nasi-goreng", name: "Nasi Goreng", price: 13000, image: "images/Nasi-Goreng.jpg" },
        { id: "mie-goreng", name: "Mie Goreng", price: 10000, image: "images/mie goreng.jpg" },
        { id: "soto", name: "Soto", price: 12000, image: "images/soto-ayam.jpg" }
      ],
      "snack": [
        { id: "nabati-wafer", name: "Nabati Richeese Wafer", price: 2500, image: "images/nabati-richeese.jpg" },
        { id: "tango-wafer", name: "Tango Wafer Coklat", price: 6500, image: "images/tanggo.png" },
        { id: "roma-malkist", name: "Roma Malkist Kelapa", price: 6500, image: "images/roma malkist kelapa.jpg" },
        { id: "roma-sari-gandum", name: "Roma Sari Gandum", price: 7500, image: "images/roma sari gandum.jpg" },
        { id: "better-sandwich", name: "Better Sandwich Biskuit", price: 2000, image: "images/better sandwich.jpg" },
        { id: "slai-olai", name: "Slai O'lai Stroberi", price: 8500, image: "images/slai olai.jpg" },
        { id: "oreo-mini-roll", name: "Oreo Mini", price: 6000, image: "images/oreo mini.jpeg" },
        { id: "roti-sisir-manis", name: "Roti Sisir Mentega", price: 5000, image: "images/roti sisir mentega.jxl" },
        { id: "sari-roti-krim", name: "Sari Roti Krim Coklat", price: 5000, image: "images/sari roti coklat.jpg" },
        { id: "pocky-pepero", name: "Pocky Coklat", price: 8500, image: "images/pocky coklat.jpg" },
        { id: "chitato-lite", name: "Chitato Sapi Panggang", price: 10000, image: "images/chitato sapi panggang.jpg" },
        { id: "qtela-singkong", name: "Qtela Keripik Singkong Balado", price: 7500, image: "images/qtela sapi panggang.jpg" },
        { id: "taro-net", name: "Taro Net Keju", price: 3000, image: "images/taro net.jpg" },
        { id: "chiki-balls-twist", name: "Chiki Balls Keju", price: 2500, image: "images/chiki ball.jpg" },
        { id: "jetz-stick", name: "Jetz Stick Coklat", price: 2500, image: "images/jet z.jpg" },
        { id: "kusuka-singkong", name: "Kusuka Keripik Singkong", price: 6500, image: "images/kusuka kripik singkong.jpg" },
        { id: "makaroni-ngehe", name: "Makaroni Pedas Kemasan", price: 6000, image: "images/makaroni pedas.jpg" },
        { id: "basreng-pedas-kemasan", name: "Basreng Pedas Kemasan", price: 7000, image: "images/basreng pedas.jpg" },
        { id: "kacang-pilus-garuda", name: "Kacang Atom Garuda", price: 4000, image: "images/kacang atom garuda.jpg" },
        { id: "emping-keripik-tempe", name: "Keripik Tempe Kemasan", price: 8000, image: "images/kripik tempe.jpg" },
        { id: "silverqueen-chunky", name: "SilverQueen Chunky Bar", price: 12000, image: "images/sliverquen.webp" },
        { id: "beng-beng", name: "Beng-Beng Wafer Coklat", price: 2500, image: "images/beng beng.jpg" },
        { id: "top-chocolatos", name: "Chocolatos Wafer Roll", price: 2000, image: "images/chocolatos.jpg" },
        { id: "yupi-gummy", name: "Yupi Gummy Strawberry", price: 5000, image: "images/yuppy gummy.png" },
        { id: "inaco-jelly-cup", name: "Inaco Jelly Cup", price: 2000, image: "images/inaco_inaco-jelly_full02.webp" },
        { id: "pilus-sukro", name: "Pilus Sukro Panggang", price: 3000, image: "images/pilus sukro.jpg" },
        { id: "astor-wafer-stick", name: "Astor Wafer Stick", price: 9000, image: "images/astor wafer.jpg" },
        { id: "kopiko-relaxa-kis", name: "Permen Kopiko", price: 1500, image: "images/permen kopiko.jpg" },
        { id: "cimory-squeeze-pudding", name: "Cimory Squeeze Yogurt", price: 9500, image: "images/cimory yogurt.jpg" },
        { id: "kue-bolu-brownies", name: "Bolu Kukus Mini", price: 6000, image: "images/bolu kukus mini.jpg" }
      ],
      "minuman": [
        { id: "ultra-milk-coklat", name: "Ultra Milk Coklat 250ml", price: 7500, image: "images/ultra milk.webp" },
        { id: "cimory-yogurt-strawberry", name: "Cimory Yogurt Drink Strawberry", price: 8500, image: "images/cimory yogurt drink.jpg" },
        { id: "bear-brand-steril", name: "Bear Brand Susu Steril", price: 10500, image: "images/bear brand.jpg" },
        { id: "indomilk-coklat", name: "Indomilk Susu Cair Coklat", price: 6500, image: "images/indomilk coklat.jpg" },
        { id: "golda-cappucino", name: "Golda Coffee Cappucino", price: 4000, image: "images/golda coffe.webp" },
        { id: "good-day-freeze-mocafrio", name: "Good Day Freeze Mocafrio", price: 7000, image: "images/good day" },
        { id: "nescafe-kaleng-original", name: "Nescafe Kaleng Original", price: 7500, image: "images/nescafe kaleng.jpg" },
        { id: "kapal-api-kopi-susu", name: "Kapal Api Kopi Susu Botol", price: 6000, image: "images/kapal api.webp" },
        { id: "teh-pucuk-harum", name: "Teh Pucuk Harum", price: 4000, image: "images/teh pucuk.jpg" },
        { id: "ichitan-thai-milk-tea", name: "Ichitan Thai Milk Tea", price: 8500, image: "images/ichitan tahi tea.webp" },
        { id: "frestea-melati", name: "Frestea Teh Melati", price: 4500, image: "images/fresh tea.jpg" },
        { id: "fruit-tea-apel", name: "Fruit Tea Apel", price: 5000, image: "images/fruit tea.jpg" },
        { id: "buavita-mangga", name: "Buavita Jus Mangga", price: 8000, image: "images/buavita mangga.jpg" },
        { id: "floridina-coco-jeruk", name: "Floridina Coco Jeruk", price: 3500, image: "images/floridina coco.jpg" },
        { id: "montea-teh-susu", name: "Montea Teh Susu", price: 6500, image: "images/montea.jpg" },
        { id: "pocari-sweat-350ml", name: "Pocari Sweat 350ml", price: 7500, image: "images/pocari sweat.jpg" },
        { id: "mizone-lychee-lemon", name: "Mizone Lychee Lemon", price: 5000, image: "images/mizone.webp" },
        { id: "sprite-kaleng", name: "Sprite Kaleng", price: 6500, image: "images/sprite kaleng.webp" },
        { id: "coca-cola-kaleng", name: "Coca-Cola Kaleng", price: 6500, image: "images/coca cola kaleng.jpg" },
        { id: "le-minerale-600ml", name: "Le Minerale 600ml", price: 3500, image: "images/le minerale.avif" }
      ],
      "alat-tulis": [
        { id: "buku-tulis", name: "Buku Tulis 40 Lembar", price: 4000, image: "images/buku tulis.jpeg" },
        { id: "pulpen-biru", name: "Pulpen Tinta Biru", price: 3000, image: "images/polpen biru.jpg" },
        { id: "pensil-2b", name: "Pensil 2B", price: 2500, image: "images/pensil 2b.jpg" },
        { id: "penghapus-putih", name: "Penghapus Putih", price: 2000, image: "images/penghapus putih.webp" },
        { id: "buku-gambar", name: "Buku Gambar", price: 5000, image: "images/buku gambar.jpg" },
        { id: "stabilo", name: "Stabilo", price: 6000, image: "images/stabilo boss.jpg" },
        { id: "penggaris-30cm", name: "Penggaris 30 cm", price: 3000, image: "images/penggaris-30-cm.webp" },
        { id: "rautan-pensil", name: "Rautan Pensil", price: 2500, image: "images/rautan pensil.jpg" },
        { id: "spidol-hitam", name: "Spidol Hitam", price: 5000, image: "images/spidol hitam.jpg" },
        { id: "map-plastik", name: "Map Plastik", price: 3000, image: "images/map plastik.png" },
        { id: "tip-ex", name: "Tip Ex", price: 5000, image: "images/tipe ex.jpg" },
        { id: "pensil-warna", name: "Pensil Warna", price: 12000, image: "images/pensil warna.jpg" },
        { id: "kotak-pensil", name: "Kotak Pensil", price: 15000, image: "images/kotak pensil.jpg" },
        { id: "pita-koreksi", name: "Pita Koreksi", price: 6000, image: "images/pita koreksi.jpg" },
        { id: "lem-kertas", name: "Lem Kertas", price: 4000, image: "images/lem kertas.jpg" }
      ],
      "peralatan-mandi": [
        // Produk peralatan mandi; foto masih berupa placeholder yang dapat diganti.
        { id: "sabun-mandi", name: "Sabun Mandi", price: 4500, image: "images/lifebuoy.webp" },
        { id: "shampoo", name: "Shampo", price: 18000, image: "images/shampo.png" },
        { id: "pasta-gigi", name: "Pasta Gigi", price: 9500, image: "images/pasta gigi.jpg" },
        { id: "sikat-gigi", name: "Sikat Gigi", price: 6000, image: "images/sikat gigi.webp" },
        { id: "sabun-wajah", name: "Sabun Wajah", price: 20000, image: "images/sabun wajah.png" },
        { id: "deterjen", name: "Deterjen", price: 5000, image: "images/detergen.png" },
        { id: "pelembut-pakaian", name: "Pelembut Pakaian", price: 10000, image: "images/pelembut pakaian.jpeg" },
        { id: "handuk-peralatan-mandi", name: "Handuk", price: 25000, image: "images/handuk.jpg" },
        { id: "keranjang-mandi", name: "Keranjang Mandi", price: 18000, image: "images/keranjang mandi.png" },
        { id: "gayung-mandi", name: "Gayung Mandi", price: 8000, image: "images/gayung mandi.jpg" }
      ],
      "kebutuhan-pribadi": [
        // Produk kebutuhan pribadi; foto masih berupa placeholder yang dapat diganti.
        { id: "parfum", name: "Parfum", price: 15000, image: "images/parfum.jpg" },
        { id: "body-lotion", name: "Body Lotion", price: 14000, image: "images/body lotion.png" },
        { id: "minyak-rambut", name: "Minyak Rambut", price: 10000, image: "images/minyak rambut.jpg" },
        { id: "celak", name: "Celak", price: 8000, image: "images/celak.jpg" },
        { id: "kaos-kaki-kulit", name: "Kaos Kaki Kulit", price: 15000, image: "images/kaos kaki kulit.webp" },
        { id: "kaos-kaki-polos", name: "Kaos Kaki Polos", price: 10000, image: "images/kaos kaki polos.jpg" },
        { id: "ciput", name: "Ciput", price: 9000, image: "images/ciput.webp" },
        { id: "ikat-pinggang-pribadi", name: "Ikat Pinggang", price: 18000, image: "images/Vendor-Ikat-Pinggang.webp" },
        { id: "saput-bedak", name: "Saput Bedak", price: 6000, image: "images/saput bedak.jpg" },
        { id: "botol-minum-pribadi", name: "Botol Minum", price: 22000, image: "images/botol minum.jpg" }
      ],
      "aksesoris": [
        { id: "jedai-ikat-rambut", name: "Jedai dan Ikat Rambut", price: 6000, image: "images/jedai.jpg" },
        { id: "sisir-aksesoris", name: "Sisir", price: 5000, image: "images/sisir.jpg" },
        { id: "pin-pondok", name: "Pin Pondok", price: 10000, image: "images/pin pondok.jpg" },
        { id: "jarum-pentul-peniti", name: "Jarum Pentul dan Peniti", price: 6500, image: "images/jarum pentul.jpg" },
        { id: "cermin-kecil", name: "Cermin Kecil", price: 12000, image: "images/cermin kecil.webp" }
      ],
      "seragam": [
        { id: "seragam-pramuka-1-set", name: "Seragam Pramuka 1 Set", price: 135000, image: "images/baju pramuka.jpeg" },
        { id: "seragam-olahraga-1-set", name: "Seragam Olahraga 1 Set", price: 120000, image: "images/seragam olah raga.jpeg" },
        { id: "seragam-almamater-1-set", name: "Seragam Almamater 1 Set", price: 150000, image: "images/baju almamater.jpeg" },
        { id: "seragam-senin-1-set", name: "Seragam Hari Senin 1 Set", price: 130000, image: "images/baju hari senin.jpeg" },
        { id: "seragam-madin-1-set", name: "Seragam Madin 1 Set", price: 125000, image: "images/baju madin.jpeg" }
      ],
      "alat-sholat": [
        { id: "sarung", name: "Sarung", price: 75000, image: "images/sarung.jpg" },
        { id: "sajadah", name: "Sajadah", price: 35000, image: "images/sajadah.jpg" },
        { id: "mukena", name: "Mukena", price: 85000, image: "images/mukena.jpg" },
        { id: "tasbih", name: "Tasbih", price: 10000, image: "images/tasbih.png" },
        { id: "siwak", name: "Siwak", price: 5000, image: "images/siwak.jpg" }
      ],
      "kitab": [
        // Daftar kitab sesuai daftar pengguna; ganti path foto placeholder dengan sampul asli.
        { id: "khulasoh-madad-nabawi", name: "Khulasoh Madad Nabawi", price: 18000, image: "images/khulasoh madad nabawi.jpg" },
        { id: "safinatun-najah", name: "Kitab Safinatun Najah", price: 15000, image: "images/kitab safinatun najah.jpg" },
        { id: "jurumiyah", name: "Kitab Jurumiyah", price: 15000, image: "images/kitab jurumiyah.jpg" },
        { id: "imriti", name: "Kitab Imriti", price: 18000, image: "images/kitab imriti.jpg" },
        { id: "alfiyah-ibnu-malik", name: "Kitab Alfiyah Ibnu Malik", price: 35000, image: "images/kitab alfiyah.jpg" },
        { id: "fathul-qorib", name: "Kitab Fathul Qorib", price: 25000, image: "images/kitab fathul qarib.jpg" },
        { id: "talimul-mutallim", name: "Kitab Ta'limul Muta'allim", price: 16000, image: "images/kitab ta'lim muta'alim.jpg" },
        { id: "mabadi-fiqhiyah", name: "Kitab Mabadi Fiqhiyah", price: 14000, image: "images/kitab mabadi fiqih.jpg" },
        { id: "arbain-nawawi", name: "Kitab Arbain Nawawi", price: 15000, image: "images/kitab arbain nawawi.jpg" },
        { id: "tijan-darori", name: "Kitab Tijan Darori", price: 14000, image: "images/kitab tijan darori.png" }
      ]
    };
    // Batasi tampilan awal lima produk; render kategori baru selalu memulai dari batas ini.
    var initialLimit = 5;
    var filters = filterContainer.querySelectorAll("[data-catalog-category]");
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var categoryIdleAnimations = [];
    var animateCatalogElements = function(elements) {
      if (prefersReducedMotion) {
        return;
      }

      elements.forEach(function(element, index) {
        if (typeof element.animate === "function") {
          element.animate(
            [
              { opacity: 0, transform: "translateY(14px) scale(0.98)" },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ],
            {
              duration: 460,
              delay: index * 55,
              easing: "cubic-bezier(0.2, 0.75, 0.25, 1)",
            }
          );
        }
      });
    };
    var startCategoryIdleMotion = function() {
      if (prefersReducedMotion || categoryIdleAnimations.length) {
        return;
      }

      filters.forEach(function(filter, index) {
        var categoryItem = filter.parentElement || filter;
        if (typeof categoryItem.animate !== "function") {
          return;
        }

        categoryIdleAnimations.push(categoryItem.animate(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(-3px)" },
            { transform: "translateY(0)" },
          ],
          {
            duration: 2600 + (index % 3) * 240,
            delay: index * 100,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        ));
      });
    };
    var setCategoryIdleMotionPaused = function(paused) {
      categoryIdleAnimations.forEach(function(animation) {
        if (paused) {
          animation.pause();
        } else {
          animation.play();
        }
      });
    };
    if ("IntersectionObserver" in window) {
      var catalogCategoryObserver = new IntersectionObserver(function(entries, observer) {
        if (entries.some(function(entry) {
          return entry.isIntersecting;
        })) {
          animateCatalogElements(Array.prototype.slice.call(filters));
          startCategoryIdleMotion();
          observer.disconnect();
        }
      }, { threshold: 0.12 });
      catalogCategoryObserver.observe(filterContainer);
    } else {
      animateCatalogElements(Array.prototype.slice.call(filters));
      startCategoryIdleMotion();
    }
    var cart = [];
    var cartList = document.getElementById("catalogCartItems");
    var cartEmptyState = document.getElementById("catalogCartEmpty");
    var cartCount = document.getElementById("catalogCartCount");
    var cartTotal = document.getElementById("catalogCartTotal");
    var headerCartButton = document.getElementById("headerCartButton");
    var headerCartCount = document.getElementById("headerCartCount");
    var cartLiveRegion = document.getElementById("catalogCartLiveRegion");
    var cartFeedback = document.getElementById("catalogCartFeedback");
    var cartFeedbackTimer = 0;
    var orderForm = document.getElementById("qafOrderForm");
    var orderStatus = document.getElementById("qafOrderStatus");
    var orderCartItems = document.getElementById("orderCartItems");
    var orderCartTotal = document.getElementById("orderCartTotal");
    var orderCartCount = document.getElementById("orderCartCount");
    var orderCartEmpty = document.getElementById("orderCartEmpty");
    var orderReceivingMethod = document.getElementById("orderReceivingMethod");
    var orderRecipientInput = document.getElementById("orderRecipientName");
    var orderDormInput = document.getElementById("orderDorm");
    var orderRoomInput = document.getElementById("orderRoom");
    var orderHistoryList = document.getElementById("orderHistoryList");
    var orderHistoryEmpty = document.getElementById("orderHistoryEmpty");
    var orderStorageAvailable = true;
    var orderHistory = [];
    var rupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    });

    // Ringkasan, submit, dan riwayat pesanan memakai sumber state keranjang yang sama.
    var setOrderStatus = function(message, type) {
      if (!orderStatus) {
        return;
      }

      orderStatus.className = "qaf-order-status qaf-order-status-" + type;
      orderStatus.textContent = message;
    };

    var renderOrderSummary = function() {
      if (!orderCartItems || !orderCartTotal || !orderCartCount || !orderCartEmpty) {
        return;
      }

      orderCartItems.textContent = "";
      var itemCount = 0;
      var total = 0;
      cart.forEach(function(item) {
        itemCount += item.quantity;
        if (!item.product.isRequest) {
          total += item.product.price * item.quantity;
        }

        var row = document.createElement("li");
        var itemName = document.createElement("span");
        var itemPrice = document.createElement("strong");
        var itemDetails = document.createElement("small");

        row.className = "qaf-order-item";
        itemName.className = "qaf-order-item-name";
        itemName.textContent = item.product.name;
        itemDetails.className = "qaf-order-item-details";
        itemDetails.textContent = item.category + " · Jumlah " + item.quantity;
        itemPrice.className = "qaf-order-item-price";
        itemPrice.textContent = item.product.isRequest
          ? "Harga konfirmasi"
          : rupiah.format(item.product.price * item.quantity);
        var itemInfo = document.createElement("div");
        itemInfo.className = "qaf-order-item-info";
        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemDetails);
        row.appendChild(itemInfo);
        row.appendChild(itemPrice);
        orderCartItems.appendChild(row);
      });

      orderCartCount.textContent = itemCount + " barang";
      orderCartTotal.textContent = rupiah.format(total);
      orderCartEmpty.classList.toggle("d-none", cart.length > 0);
      orderCartItems.classList.toggle("d-none", cart.length === 0);
    };

    var renderOrderHistory = function() {
      if (!orderHistoryList || !orderHistoryEmpty) {
        return;
      }

      orderHistoryList.textContent = "";
      if (!orderHistory.length) {
        orderHistoryList.appendChild(orderHistoryEmpty);
        return;
      }

      orderHistory.forEach(function(order) {
        var card = document.createElement("article");
        var header = document.createElement("div");
        var heading = document.createElement("h3");
        var timestamp = document.createElement("time");
        var details = document.createElement("p");
        var itemList = document.createElement("ul");
        var total = document.createElement("strong");

        card.className = "qaf-history-card";
        header.className = "qaf-history-header";
        heading.className = "qaf-history-title";
        heading.textContent = "Pesanan " + order.id + " · " + order.customerName;
        timestamp.className = "qaf-history-date";
        timestamp.dateTime = order.createdAt;
        timestamp.textContent = new Intl.DateTimeFormat("id-ID", {
          dateStyle: "medium",
          timeStyle: "short"
        }).format(new Date(order.createdAt));
        details.className = "qaf-history-details";
        details.textContent = order.customerType + " · " + order.phone +
          (order.studentName ? " · Santri: " + order.studentName : "") +
          (order.email ? " · " + order.email : "") +
          (order.recipientName ? " · Penerima: " + order.recipientName : "") +
          " · " + order.receivingMethod +
          (order.dorm ? " · Asrama: " + order.dorm + (order.room ? " · Kelas: " + order.room : "") : "") +
          " · Pembayaran: " + order.paymentMethod;
        itemList.className = "qaf-history-items";
        order.items.forEach(function(item) {
          var itemRow = document.createElement("li");
          itemRow.textContent = item.name + " × " + item.quantity + " · " +
            (item.isRequest ? "Harga konfirmasi" : rupiah.format(item.price * item.quantity));
          itemList.appendChild(itemRow);
        });
        total.className = "qaf-history-total";
        total.textContent = "Total: " + rupiah.format(order.total);
        header.appendChild(heading);
        header.appendChild(timestamp);
        card.appendChild(header);
        card.appendChild(details);
        card.appendChild(itemList);
        if (order.notes) {
          var note = document.createElement("p");
          note.className = "qaf-history-note";
          note.textContent = "Catatan: " + order.notes;
          card.appendChild(note);
        }
        card.appendChild(total);
        orderHistoryList.appendChild(card);
      });
    };

    try {
      var savedOrders = window.localStorage.getItem("qafMarketOrderHistory");
      if (savedOrders) {
        var parsedOrders = JSON.parse(savedOrders);
        if (!Array.isArray(parsedOrders) || parsedOrders.some(function(order) {
          return !order || typeof order.id !== "string" ||
            typeof order.createdAt !== "string" ||
            !isFinite(Date.parse(order.createdAt)) ||
            typeof order.customerName !== "string" ||
            typeof order.customerType !== "string" ||
            typeof order.phone !== "string" ||
            typeof order.receivingMethod !== "string" ||
            typeof order.paymentMethod !== "string" ||
            typeof order.total !== "number" ||
            !Array.isArray(order.items) ||
            order.items.some(function(item) {
              return !item || typeof item.name !== "string" ||
                typeof item.quantity !== "number" || item.quantity < 1 ||
                typeof item.price !== "number" || item.price < 0;
            });
        })) {
          throw new Error("Format riwayat pesanan tidak valid.");
        }
        orderHistory = parsedOrders;
      }
    } catch (error) {
      orderStorageAvailable = false;
      orderHistory = [];
      setOrderStatus("Riwayat pesanan tidak dapat dibaca dari penyimpanan perangkat. Pesanan belum bisa dikirim.", "error");
    }
    renderOrderHistory();
    renderOrderSummary();

    if (orderReceivingMethod && orderDormInput && orderRoomInput) {
      var updateOrderDeliveryFields = function() {
        var isDormDelivery = orderReceivingMethod.value === "Antar ke Asrama/Kamar";
        orderDormInput.required = isDormDelivery;
        orderRoomInput.required = isDormDelivery;
      };
      orderReceivingMethod.addEventListener("change", updateOrderDeliveryFields);
      updateOrderDeliveryFields();
    }

    if (orderForm) {
      var customerNameInput = document.getElementById("orderCustomerName");
      var customerPhoneInput = document.getElementById("orderPhone");
      [customerNameInput, customerPhoneInput, orderRecipientInput].forEach(function(input) {
        if (input) {
          input.addEventListener("input", function() {
            input.setCustomValidity("");
          });
        }
      });

      orderForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var emptyRequiredInput = [
          { input: customerNameInput, message: "Nama pemesan wajib diisi." },
          { input: customerPhoneInput, message: "Nomor WhatsApp atau HP wajib diisi." },
          { input: orderRecipientInput, message: "Nama penerima wajib diisi." }
        ].filter(function(field) {
          return field.input && !field.input.value.trim();
        })[0];
        if (emptyRequiredInput) {
          emptyRequiredInput.input.setCustomValidity(emptyRequiredInput.message);
          emptyRequiredInput.input.reportValidity();
          return;
        }
        if (!cart.length) {
          setOrderStatus("Keranjang masih kosong. Tambahkan produk terlebih dahulu sebelum mengirim pesanan.", "error");
          return;
        }
        if (!orderStorageAvailable) {
          setOrderStatus("Penyimpanan riwayat tidak tersedia. Pesanan belum dapat disimpan; keranjang Anda tetap aman.", "error");
          return;
        }

        var formData = new FormData(orderForm);
        var orderItems = cart.map(function(item) {
          return {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            isRequest: Boolean(item.product.isRequest),
            category: item.category,
            quantity: item.quantity
          };
        });
        var orderTotal = orderItems.reduce(function(sum, item) {
          return sum + (item.isRequest ? 0 : item.price * item.quantity);
        }, 0);
        var createdAt = new Date().toISOString();
        var order = {
          id: "QAF-" + Date.now().toString(36).toUpperCase(),
          createdAt: createdAt,
          customerType: String(formData.get("customerType")),
          customerName: String(formData.get("customerName")).trim(),
          recipientName: String(formData.get("recipientName")).trim(),
          studentName: String(formData.get("studentName") || "").trim(),
          phone: String(formData.get("phone")).trim(),
          email: String(formData.get("email") || "").trim(),
          receivingMethod: String(formData.get("receivingMethod")),
          dorm: String(formData.get("dorm") || "").trim(),
          room: String(formData.get("room") || "").trim(),
          paymentMethod: String(formData.get("paymentMethod")),
          notes: String(formData.get("notes") || "").trim(),
          items: orderItems,
          total: orderTotal
        };
        var updatedHistory = [order].concat(orderHistory);

        try {
          window.localStorage.setItem("qafMarketOrderHistory", JSON.stringify(updatedHistory));
        } catch (error) {
          setOrderStatus("Pesanan gagal disimpan pada perangkat ini. Keranjang Anda tetap aman; coba lagi setelah penyimpanan tersedia.", "error");
          return;
        }

        orderHistory = updatedHistory;
        renderOrderHistory();
        cart.length = 0;
        renderCart();
        orderForm.reset();
        if (orderReceivingMethod) {
          orderReceivingMethod.dispatchEvent(new Event("change"));
        }
        setOrderStatus("Pesanan " + order.id + " berhasil disimpan dan tampil di Riwayat Pesanan.", "success");
        var historySection = document.getElementById("riwayat-pesanan");
        if (historySection) {
          historySection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    var createProductPlaceholder = function(product, categoryName) {
      var seed = product.id + "-" + categoryName;
      var hue = 0;
      for (var index = 0; index < seed.length; index += 1) {
        hue = (hue * 31 + seed.charCodeAt(index)) % 360;
      }

      var accentHue = (hue + 145) % 360;
      var escapeXml = function(value) {
        return value.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
      };
      var displayName = product.name.length > 30 ? product.name.slice(0, 27) + "..." : product.name;
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 330">' +
        '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">' +
        '<stop stop-color="hsl(' + hue + ', 55%, 92%)"/>' +
        '<stop offset="1" stop-color="hsl(' + accentHue + ', 48%, 84%)"/>' +
        '</linearGradient></defs>' +
        '<rect width="440" height="330" rx="24" fill="url(#bg)"/>' +
        '<circle cx="355" cy="72" r="66" fill="hsl(' + accentHue + ', 58%, 55%)" opacity=".22"/>' +
        '<rect x="100" y="28" width="240" height="274" rx="24" fill="#fffdf9" stroke="hsl(' + hue + ', 30%, 52%)" stroke-width="3"/>' +
        '<path d="M100 52a24 24 0 0 1 24-24h192a24 24 0 0 1 24 24v24H100z" fill="hsl(' + hue + ', 48%, 43%)"/>' +
        '<rect x="124" y="101" width="192" height="104" rx="14" fill="hsl(' + accentHue + ', 54%, 88%)"/>' +
        '<circle cx="220" cy="153" r="28" fill="hsl(' + hue + ', 47%, 50%)"/>' +
        '<path d="M207 153h26m-13-13v26" stroke="#fffdf9" stroke-width="6" stroke-linecap="round"/>' +
        '<text x="220" y="62" text-anchor="middle" fill="#fffdf9" font-family="Arial,sans-serif" font-size="16" font-weight="700">QAF MARKET</text>' +
        '<text x="220" y="237" text-anchor="middle" fill="#493324" font-family="Arial,sans-serif" font-size="17" font-weight="700">' + escapeXml(displayName) + '</text>' +
        '<text x="220" y="265" text-anchor="middle" fill="#76533a" font-family="Arial,sans-serif" font-size="13">' + escapeXml(categoryName) + '</text>' +
        '<text x="220" y="287" text-anchor="middle" fill="#8b6343" font-family="Arial,sans-serif" font-size="10">PLACEHOLDER FOTO PRODUK</text>' +
        '<title>' + escapeXml(product.name) + '</title></svg>';

      return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    };

    var renderCart = function() {
      var itemCount = 0;
      var total = 0;

      renderOrderSummary();
      cart.forEach(function(item) {
        itemCount += item.quantity;
        if (!item.product.isRequest) {
          total += item.product.price * item.quantity;
        }
      });

      if (cartCount) {
        cartCount.textContent = String(itemCount);
      }
      if (headerCartCount) {
        headerCartCount.textContent = String(itemCount);
        headerCartCount.classList.toggle("d-none", itemCount === 0);
      }
      if (headerCartButton) {
        headerCartButton.setAttribute("aria-label", "Keranjang belanja, " + itemCount + " barang");
      }
      if (cartTotal) {
        cartTotal.textContent = rupiah.format(total);
      }
      if (!cartList || !cartEmptyState) {
        return;
      }

      cartList.textContent = "";
      if (!cart.length) {
        cartList.appendChild(cartEmptyState);
        return;
      }

      cart.forEach(function(item) {
        var row = document.createElement("li");
        var details = document.createElement("div");
        var name = document.createElement("h6");
        var quantity = document.createElement("small");
        var price = document.createElement("span");

        row.className = "list-group-item d-flex justify-content-between align-items-start gap-3";
        details.className = "me-auto";
        name.className = "my-0";
        name.textContent = item.product.name;
        quantity.className = "text-body-secondary";
        quantity.textContent = item.category + " · " +
          (item.product.isRequest ? "Request · Jumlah " : "Jumlah ") + item.quantity;
        price.className = "text-body-secondary text-nowrap";
        price.textContent = item.product.isRequest
          ? "Harga konfirmasi"
          : rupiah.format(item.product.price * item.quantity);
        details.appendChild(name);
        details.appendChild(quantity);
        row.appendChild(details);
        row.appendChild(price);
        cartList.appendChild(row);
      });
    };

    // Validate the requested quantity, then merge it into the matching cart entry.
    var addToCart = function(product, categoryName, quantityInput, button) {
      var quantity = parseInt(quantityInput.value, 10);
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
      }
      quantityInput.value = String(quantity);

      var existingItem = null;
      cart.forEach(function(item) {
        if (item.product.id === product.id) {
          existingItem = item;
        }
      });

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ product: product, category: categoryName, quantity: quantity });
      }

      renderCart();
      if (cartLiveRegion) {
        cartLiveRegion.textContent = product.isRequest
          ? "Request " + product.name + " ditambahkan ke keranjang."
          : quantity + " " + product.name + " ditambahkan ke keranjang.";
      }
      if (cartFeedback) {
        cartFeedback.textContent = product.isRequest
          ? "Request " + product.name + " berhasil ditambahkan ke keranjang."
          : quantity + " " + product.name + " berhasil ditambahkan ke keranjang.";
        cartFeedback.classList.remove("d-none");
        window.clearTimeout(cartFeedbackTimer);
        cartFeedbackTimer = window.setTimeout(function() {
          cartFeedback.classList.add("d-none");
        }, 2400);
      }
      quantityInput.value = "1";
      button.textContent = "Ditambahkan";
      var defaultButtonText = button.getAttribute("data-default-label") || "+ Keranjang";
      window.setTimeout(function() {
        button.textContent = defaultButtonText;
      }, 1200);
    };

    var renderCategory = function(filter) {
      var categoryId = filter.getAttribute("data-catalog-category");
      var categoryName = filter.getAttribute("data-category-name");
      var products = productsByCategory[categoryId] || [];
      var panel = document.createElement("section");
      var backButton = document.createElement("button");
      var heading = document.createElement("h3");
      var grid = document.createElement("div");

      contentContainer.textContent = "";
      panel.className = "catalog-category-panel";
      backButton.type = "button";
      backButton.className = "btn catalog-category-back";
      backButton.setAttribute("aria-label", "Kembali ke pilihan kategori");
      backButton.textContent = "← Kembali ke kategori";
      backButton.addEventListener("click", function() {
        contentContainer.hidden = true;
        contentContainer.textContent = "";
        filterContainer.hidden = false;
        setCategoryIdleMotionPaused(false);
        animateCatalogElements(Array.prototype.slice.call(filters));
        filter.focus();
      });
      heading.className = "h4 mb-2";
      heading.tabIndex = -1;
      heading.textContent = categoryName;
      grid.className = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 catalog-product-grid";
      grid.id = "catalog-products-" + categoryId;

      products.forEach(function(product, index) {
        var column = document.createElement("div");
        var card = document.createElement("article");
        var figure = document.createElement("figure");
        var image = document.createElement("img");
        var body = document.createElement("div");
        var name = document.createElement("h4");
        var price = document.createElement("p");
        var actions = document.createElement("div");
        var quantityInput = document.createElement("input");
        var addButton = document.createElement("button");

        column.className = "col d-flex";
        if (index >= initialLimit) {
          column.classList.add("d-none");
          column.setAttribute("data-catalog-overflow", "");
        }

        card.className = "catalog-product-card h-100 w-100 d-flex flex-column";
        figure.className = "catalog-product-image";
        image.className = "img-fluid";
        var usesGenericPlaceholder = /^images\/product-thumb-\d+\.png$/i.test(product.image);
        image.src = usesGenericPlaceholder
          ? createProductPlaceholder(product, categoryName)
          : product.image;
        image.alt = product.name;
        image.loading = "lazy";
        figure.appendChild(image);

        body.className = "catalog-product-body d-flex flex-column flex-grow-1 text-center";
        name.className = "fs-6 fw-semibold";
        name.textContent = product.name;
        price.className = "catalog-product-price fs-5 fw-bold mb-3";
        price.textContent = rupiah.format(product.price);
        actions.className = "catalog-cart-actions d-flex align-items-center gap-2 mt-auto";
        quantityInput.type = "number";
        quantityInput.className = "form-control catalog-product-quantity";
        quantityInput.min = "1";
        quantityInput.step = "1";
        quantityInput.value = "1";
        quantityInput.inputMode = "numeric";
        quantityInput.setAttribute("aria-label", "Jumlah " + product.name);
        addButton.type = "button";
        addButton.className = "btn catalog-add-to-cart flex-grow-1";
        addButton.textContent = "+ Keranjang";
        addButton.setAttribute("data-default-label", "+ Keranjang");
        addButton.setAttribute("aria-label", "Tambah " + product.name + " ke keranjang");
        addButton.addEventListener("click", function() {
          addToCart(product, categoryName, quantityInput, addButton);
        });
        actions.appendChild(quantityInput);
        actions.appendChild(addButton);
        body.appendChild(name);
        body.appendChild(price);
        body.appendChild(actions);
        card.appendChild(figure);
        card.appendChild(body);
        column.appendChild(card);
        grid.appendChild(column);
      });

      panel.appendChild(backButton);
      panel.appendChild(heading);
      panel.appendChild(grid);

      if (products.length > initialLimit) {
        var toggleButton = document.createElement("button");
        var toggleLabel = document.createElement("span");
        var remainingCount = document.createElement("span");
        var expanded = false;

        toggleButton.type = "button";
        toggleButton.className = "btn catalog-show-more mt-3";
        toggleLabel.textContent = "Tampilkan Semua Produk";
        remainingCount.className = "catalog-show-more-count";
        remainingCount.textContent = "(" + (products.length - initialLimit) + " produk lainnya)";
        toggleButton.appendChild(toggleLabel);
        toggleButton.appendChild(remainingCount);
        toggleButton.setAttribute("aria-controls", grid.id);
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.addEventListener("click", function() {
          expanded = !expanded;
          toggleButton.disabled = true;
          var animations = [];
          var reduceMotion = window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          // Animasi kartu tambahan saat diperluas atau diringkas, dengan fallback tanpa animasi.
          grid.querySelectorAll("[data-catalog-overflow]").forEach(function(column, index) {
            if (expanded) {
              column.classList.remove("d-none");
            }

            if (typeof column.animate !== "function" || reduceMotion) {
              column.classList.toggle("d-none", !expanded);
              return;
            }

            var animation = column.animate(
              expanded
                ? [
                    { opacity: 0, transform: "translateY(12px)" },
                    { opacity: 1, transform: "translateY(0)" }
                  ]
                : [
                    { opacity: 1, transform: "translateY(0)" },
                    { opacity: 0, transform: "translateY(12px)" }
                  ],
              {
                duration: expanded ? 260 : 180,
                delay: Math.min(index, 8) * 24,
                easing: "ease-out",
                fill: expanded ? "none" : "forwards"
              }
            );

            if (expanded) {
              animations.push(animation.finished);
            } else {
              animations.push(animation.finished.then(function() {
                column.classList.add("d-none");
                animation.cancel();
              }));
            }
          });

          toggleLabel.textContent = expanded ? "Tampilkan Lebih Sedikit" : "Tampilkan Semua Produk";
          remainingCount.classList.toggle("d-none", expanded);
          toggleButton.setAttribute("aria-expanded", String(expanded));
          Promise.all(animations).then(function() {
            toggleButton.disabled = false;
          });
        });
        panel.appendChild(toggleButton);
      }

      // Form ini memasukkan barang di luar katalog ke keranjang sebagai request.
      var requestPanel = document.createElement("section");
      var requestHeading = document.createElement("h4");
      var requestDescription = document.createElement("p");
      var requestForm = document.createElement("form");
      var requestNameColumn = document.createElement("div");
      var requestNameLabel = document.createElement("label");
      var requestNameInput = document.createElement("input");
      var requestQuantityColumn = document.createElement("div");
      var requestQuantityLabel = document.createElement("label");
      var requestQuantityInput = document.createElement("input");
      var requestButtonColumn = document.createElement("div");
      var requestButton = document.createElement("button");
      var requestNameId = "catalog-request-name-" + categoryId;
      var requestQuantityId = "catalog-request-quantity-" + categoryId;

      requestPanel.className = "catalog-request-panel mt-4";
      requestHeading.className = "h5 mb-2";
      requestHeading.textContent = "Tidak menemukan barang yang dicari?";
      requestDescription.className = "mb-3 text-body-secondary";
      requestDescription.textContent =
        "Ajukan barang di luar katalog; harga akan dikonfirmasi pengelola.";
      requestForm.className = "catalog-request-form row g-2 align-items-end";
      requestForm.setAttribute("aria-label", "Request barang untuk kategori " + categoryName);
      requestNameColumn.className = "col-12 col-md";
      requestNameLabel.className = "form-label";
      requestNameLabel.htmlFor = requestNameId;
      requestNameLabel.textContent = "Nama barang";
      requestNameInput.id = requestNameId;
      requestNameInput.type = "text";
      requestNameInput.className = "form-control";
      requestNameInput.placeholder = "Contoh: barang yang belum tersedia";
      requestNameInput.required = true;
      requestNameInput.maxLength = 100;
      requestNameInput.autocomplete = "off";
      requestQuantityColumn.className = "col-4 col-md-2";
      requestQuantityLabel.className = "form-label";
      requestQuantityLabel.htmlFor = requestQuantityId;
      requestQuantityLabel.textContent = "Jumlah";
      requestQuantityInput.id = requestQuantityId;
      requestQuantityInput.type = "number";
      requestQuantityInput.className = "form-control";
      requestQuantityInput.min = "1";
      requestQuantityInput.step = "1";
      requestQuantityInput.value = "1";
      requestQuantityInput.inputMode = "numeric";
      requestQuantityInput.setAttribute("aria-label", "Jumlah barang request");
      requestButtonColumn.className = "col-8 col-md-3";
      requestButton.type = "submit";
      requestButton.className = "btn catalog-add-to-cart w-100";
      requestButton.textContent = "Request ke Keranjang";
      requestButton.setAttribute("data-default-label", "Request ke Keranjang");
      requestNameColumn.appendChild(requestNameLabel);
      requestNameColumn.appendChild(requestNameInput);
      requestQuantityColumn.appendChild(requestQuantityLabel);
      requestQuantityColumn.appendChild(requestQuantityInput);
      requestButtonColumn.appendChild(requestButton);
      requestForm.appendChild(requestNameColumn);
      requestForm.appendChild(requestQuantityColumn);
      requestForm.appendChild(requestButtonColumn);
      requestForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var requestedName = requestNameInput.value.trim();
        if (!requestedName) {
          requestNameInput.setCustomValidity("Masukkan nama barang yang ingin di-request.");
          requestNameInput.reportValidity();
          return;
        }

        requestNameInput.setCustomValidity("");
        requestNameInput.value = requestedName;
        addToCart({
          id: "request-" + categoryId + "-" + requestedName.toLowerCase().replace(/\s+/g, " "),
          name: requestedName,
          price: 0,
          isRequest: true
        }, categoryName, requestQuantityInput, requestButton);
        requestNameInput.value = "";
      });
      requestNameInput.addEventListener("input", function() {
        requestNameInput.setCustomValidity("");
      });
      requestPanel.appendChild(requestHeading);
      requestPanel.appendChild(requestDescription);
      requestPanel.appendChild(requestForm);
      panel.appendChild(requestPanel);

      contentContainer.appendChild(panel);
      contentContainer.hidden = false;
      filterContainer.hidden = true;
      animateCatalogElements([panel]);
      heading.focus();
    };

    // Tautan panduan memakai anchor langsung; filter ini hanya mengatur katalog.
    filters.forEach(function(filter) {
      filter.addEventListener("click", function() {
        filters.forEach(function(otherFilter) {
          var isActive = otherFilter === filter;
          otherFilter.classList.toggle("is-active", isActive);
          otherFilter.setAttribute("aria-pressed", String(isActive));
        });
        setCategoryIdleMotionPaused(true);
        renderCategory(filter);
      });
    });

  }

  var initQafLogin = function() {
    var loginForm = document.getElementById("loginForm");
    var loginModalElement = document.getElementById("loginModal");
    var loginAccess = document.getElementById("loginAccess");
    var loginCode = document.getElementById("loginCode");
    var feedback = document.getElementById("loginFeedback");
    var toggleCodeButton = document.getElementById("toggleLoginCode");
    var eyeIcon = document.getElementById("loginEyeIcon");
    var eyeSlashIcon = document.getElementById("loginEyeSlashIcon");
    var navbarLoginButton = document.getElementById("navbarLoginButton");
    var topNavigation = document.getElementById("topNavigation");
    var authNavItems = document.querySelectorAll("[data-auth-nav-item]");
    var landingHeroSection = document.getElementById("landingHeroSection");
    var loggedInDashboard = document.getElementById("loggedInDashboard");
    var activeUserBanner = document.getElementById("activeUserBanner");
    var authFloatingStatus = document.getElementById("authFloatingStatus");
    var authFloatingLogoutButton = document.getElementById("authFloatingLogoutButton");
    var authFloatingControls = document.getElementById("authFloatingControls");
    var toastElement = document.getElementById("loginToast");
    var toastMessage = document.getElementById("loginToastMessage");

    if (!loginForm || !loginModalElement || !loginAccess || !loginCode ||
        !feedback || !toggleCodeButton || !eyeIcon || !eyeSlashIcon ||
        !navbarLoginButton || !topNavigation || !authNavItems.length ||
        !landingHeroSection || !loggedInDashboard || !activeUserBanner ||
        !authFloatingStatus || !authFloatingLogoutButton ||
        !authFloatingControls ||
        !toastElement || !toastMessage) {
      return;
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        document.body.classList.contains("auth-locked")) {
      window.requestAnimationFrame(function() {
        navbarLoginButton.classList.add("login-intro");
      });
    }

    // Keep all navbar destinations, including form and order info, on-page with smooth scrolling.
    document.querySelectorAll(".top-nav-link").forEach(function(link) {
      link.addEventListener("click", function(event) {
        var target = document.querySelector(link.getAttribute("href"));
        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
        window.history.replaceState(null, "", link.getAttribute("href"));
      });
    });

    // Client-side access codes are a UI prototype, not a security boundary.
    var accessCodes = {
      "Santri": "1",
      "Guru": "2",
      "Wali Santri": "3",
      "Pengurus": "4",
      "Admin Qaf": "5"
    };
    var loginModal = window.bootstrap.Modal.getOrCreateInstance(loginModalElement);
    var loginToast = window.bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 4000 });
    var activeRole = "";
    var pendingDestination = "";

    document.querySelectorAll("[data-requires-auth], .category-carousel a[href='category.html']").forEach(function(link) {
      link.addEventListener("click", function(event) {
        if (activeRole) {
          return;
        }

        event.preventDefault();
        pendingDestination = link.getAttribute("href");
        loginModal.show();
      });
    });

    var showFeedback = function(message) {
      feedback.textContent = message;
      feedback.className = "alert alert-danger";
    };

    var showToast = function(message) {
      toastMessage.textContent = message;
      loginToast.show();
    };

    var updateAuthState = function(role) {
      activeRole = role || "";
      var isAuthenticated = Boolean(activeRole);
      var statusText = isAuthenticated ? "Akses Aktif: " + role : "";

      navbarLoginButton.classList.toggle("d-none", isAuthenticated);
      // Show only LOGIN before authentication; reveal the three main links afterward.
      authNavItems.forEach(function(item) {
        item.classList.toggle("d-none", !isAuthenticated);
      });
      // Swap the landing content, dashboard, and top navigation with the current session.
      landingHeroSection.classList.toggle("d-none", isAuthenticated);
      loggedInDashboard.classList.toggle("d-none", !isAuthenticated);
      activeUserBanner.textContent = isAuthenticated ? "Selamat datang, " + role + "!" : "Selamat datang";
      if (isAuthenticated &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
          typeof activeUserBanner.animate === "function") {
        activeUserBanner.animate(
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 650, easing: "cubic-bezier(0.2, 0.75, 0.25, 1)" }
        );
      }
      topNavigation.classList.toggle("d-none", !isAuthenticated);
      authFloatingControls.classList.toggle("d-none", !isAuthenticated);
      authFloatingStatus.textContent = statusText;
      document.body.classList.toggle("auth-locked", !isAuthenticated);

      if (!isAuthenticated) {
        window.scrollTo(0, 0);
      }
    };

    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();

      var role = loginAccess.value;
      var code = loginCode.value.trim().toUpperCase();

      if (!role) {
        showFeedback("Pilih jenis akses terlebih dahulu.");
        loginAccess.focus();
        return;
      }

      if (!code) {
        showFeedback("Kode ID wajib diisi.");
        loginCode.focus();
        return;
      }

      if (accessCodes[role] !== code) {
        showFeedback("Kode ID tidak sesuai dengan akses yang dipilih. Silakan periksa kembali.");
        loginCode.focus();
        return;
      }

      updateAuthState(role);
      loginModal.hide();
      showToast("Berhasil masuk sebagai " + role + ".");
    });

    if (toggleCodeButton) {
      toggleCodeButton.addEventListener("click", function() {
        var showCode = loginCode.type === "password";
        loginCode.type = showCode ? "text" : "password";
        toggleCodeButton.setAttribute("aria-label", showCode ? "Sembunyikan Kode ID" : "Tampilkan Kode ID");
        toggleCodeButton.setAttribute("aria-pressed", String(showCode));
        eyeIcon.classList.toggle("d-none", showCode);
        eyeSlashIcon.classList.toggle("d-none", !showCode);
      });
    }

    authFloatingLogoutButton.addEventListener("click", function() {
      updateAuthState("");
      showToast("Anda telah keluar dari QAF Market.");
    });

    loginModalElement.addEventListener("hidden.bs.modal", function() {
      loginForm.reset();
      loginCode.type = "password";
      toggleCodeButton.setAttribute("aria-label", "Tampilkan Kode ID");
      toggleCodeButton.setAttribute("aria-pressed", "false");
      eyeIcon.classList.remove("d-none");
      eyeSlashIcon.classList.add("d-none");
      feedback.textContent = "";
      feedback.className = "alert d-none";

      if (activeRole && pendingDestination) {
        var destination = pendingDestination;
        pendingDestination = "";
        if (destination.charAt(0) === "#") {
          var target = document.getElementById(destination.slice(1));
          if (target) {
            var scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
            target.scrollIntoView({ behavior: scrollBehavior });
          }
        } else {
          window.location.assign(destination);
        }
      } else {
        pendingDestination = "";
      }
    });
  }

  var initMenuInteractions = function() {
    var menuItems = document.querySelectorAll("#offcanvasNavbar .nav-item");
    var menuButton = document.querySelector(".menu-category-button");
    var offcanvasElement = document.getElementById("offcanvasNavbar");

    if (menuButton) {
        menuButton.setAttribute("aria-haspopup", "dialog");
    }

    menuItems.forEach(function(item) {
        var link = item.querySelector(".nav-link");
        if (!link) {
          return;
        }

        item.addEventListener("mouseenter", function() {
          item.style.setProperty("--menu-accent", "#6BB252");
        });

        link.addEventListener("click", function() {
          menuItems.forEach(function(otherItem) {
            otherItem.classList.remove("active");
          });
          item.classList.add("active");

          if (window.bootstrap && offcanvasElement) {
            var offcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
            if (offcanvas) {
              offcanvas.hide();
            }
          }
        });
    });

    if (offcanvasElement) {
        offcanvasElement.addEventListener("shown.bs.offcanvas", function() {
          var activeLink = offcanvasElement.querySelector(".nav-item.active .nav-link");
          if (activeLink) {
            activeLink.focus();
          }
        });
    }
  }

  var initVibrantSectionAnimations = function() {
    if (!window.IntersectionObserver) {
      document.querySelectorAll(".qaf-reveal, .qaf-reveal-card").forEach(function(element) {
        element.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px"
    });

    var registerElements = function(root) {
      var revealElements = (root || document).querySelectorAll(
        "#katalog-produk .section-header, #layanan-jasa .section-header, #riwayat-pesanan .section-header"
      );
      revealElements.forEach(function(element) {
        element.classList.add("qaf-reveal");
        observer.observe(element);
      });

      var cards = (root || document).querySelectorAll(
        "#layanan-jasa .card, #katalog-produk .catalog-product-card"
      );
      cards.forEach(function(card, index) {
        card.classList.add("qaf-reveal-card");
        card.style.transitionDelay = Math.min(index * 55, 330) + "ms";
        observer.observe(card);
      });
    };

    registerElements(document);

    var catalogContent = document.getElementById("catalog-category-content");
    if (catalogContent) {
      var catalogObserver = new MutationObserver(function() {
        registerElements(catalogContent);
      });
      catalogObserver.observe(catalogContent, { childList: true });
    }

    var spotlightCards = document.querySelectorAll(".catalog-product-card, #layanan-jasa .card");
    spotlightCards.forEach(function(card) {
      card.addEventListener("pointermove", function(event) {
        var bounds = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", ((event.clientX - bounds.left) / bounds.width * 100) + "%");
        card.style.setProperty("--spot-y", ((event.clientY - bounds.top) / bounds.height * 100) + "%");
      });
    });
  };

  var initShoppingGuideAnimation = function() {
    var guide = document.querySelector(".qaf-shopping-guide");
    if (!guide) {
      return;
    }

    var steps = guide.querySelectorAll(".qaf-shopping-step");
    if (!steps.length) {
      return;
    }

    steps.forEach(function(step) {
      step.classList.add("qaf-shopping-step-reveal");
    });

    var showGuide = function(staggerSteps) {
      guide.classList.add("is-visible");
      steps.forEach(function(step, index) {
        if (staggerSteps) {
          window.setTimeout(function() {
            step.classList.add("is-visible");
          }, Math.min(index * 180, 360));
        } else {
          step.classList.add("is-visible");
        }
      });
    };

    var prefersReducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !window.IntersectionObserver) {
      showGuide(false);
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          showGuide(true);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -30px"
    });

    observer.observe(guide);
  };

  var initServiceInfoDetails = function() {
    // Sinkronkan label, ARIA, dan panel detail pada setiap kartu layanan.
    document.querySelectorAll(".qaf-info-toggle").forEach(function(toggle) {
      var details = document.getElementById(toggle.getAttribute("aria-controls"));
      var label = toggle.querySelector(".qaf-info-toggle-label");
      if (!details || !label) {
        console.error("Kontrol penjelasan layanan tidak terhubung ke panel yang valid.");
        return;
      }

      var closeTimer = 0;
      toggle.addEventListener("click", function() {
        var isOpening = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(isOpening));
        label.textContent = isOpening ? "Tutup penjelasan" : "Baca penjelasan";
        window.clearTimeout(closeTimer);

        if (isOpening) {
          details.hidden = false;
          window.requestAnimationFrame(function() {
            if (toggle.getAttribute("aria-expanded") === "true") {
              details.classList.add("is-open");
            }
          });
          return;
        }

        details.classList.remove("is-open");
        var reduceMotion = window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
          details.hidden = true;
          return;
        }

        closeTimer = window.setTimeout(function() {
          if (toggle.getAttribute("aria-expanded") === "false") {
            details.hidden = true;
          }
        }, 300);
      });
    });
  };

  // Form ringkas untuk layanan transaksi di bagian Layanan Jasa.
  var initLayananJasa = function() {
    var section = document.getElementById("layanan-jasa");
    var summary = document.getElementById("layananSummary");
    if (!section || !summary) {
      return;
    }

    var rupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    });
    var cards = section.querySelectorAll(".layanan-service-card");

    cards.forEach(function(card) {
      card.addEventListener("click", function(event) {
        card.classList.add("is-selected");
        cards.forEach(function(otherCard) {
          if (otherCard !== card) {
            otherCard.classList.remove("is-selected");
          }
        });
      });

      var options = card.querySelectorAll(".layanan-option");
      options.forEach(function(option) {
        option.setAttribute("aria-pressed", "false");
        option.addEventListener("click", function() {
          options.forEach(function(otherOption) {
            otherOption.classList.remove("is-selected");
            otherOption.setAttribute("aria-pressed", "false");
          });
          option.classList.add("is-selected");
          option.setAttribute("aria-pressed", "true");
        });
      });

      var processButton = card.querySelector(".layanan-process-btn");
      processButton.addEventListener("click", function() {
        var selectedOption = card.querySelector(".layanan-option.is-selected");
        var cashNote = card.querySelector("#cashNote");
        var amount = selectedOption ? parseInt(selectedOption.getAttribute("data-service-value"), 10) : 0;
        var serviceName = processButton.getAttribute("data-process-service");
        var destination = "";

        if (!amount) {
          summary.classList.remove("d-none");
          summary.textContent = "Pilih nominal " + serviceName + " terlebih dahulu.";
          return;
        }

        if (serviceName === "Token Listrik (PLN)") {
          destination = card.querySelector("#tokenCustomer").value.trim();
          if (!destination) {
            summary.classList.remove("d-none");
            summary.textContent = "Masukkan nomor meter atau ID pelanggan PLN.";
            card.querySelector("#tokenCustomer").focus();
            return;
          }
        } else if (serviceName === "Pulsa HP") {
          destination = card.querySelector("#pulsaNumber").value.trim();
          if (!destination) {
            summary.classList.remove("d-none");
            summary.textContent = "Masukkan nomor HP tujuan.";
            card.querySelector("#pulsaNumber").focus();
            return;
          }
        } else if (serviceName === "Tarik Tunai") {
          destination = cashNote ? cashNote.value.trim() : "";
          if (!destination) {
            summary.classList.remove("d-none");
            summary.textContent = "Masukkan nama atau catatan penerima untuk tarik tunai.";
            cashNote.focus();
            return;
          }
        }

        var detail = serviceName + " · " + rupiah.format(amount);
        if (destination) {
          detail += " · Tujuan: " + destination;
        }
        if (serviceName === "Tarik Tunai") {
          detail += " · Biaya admin: " + rupiah.format(2500) +
            " · Total: " + rupiah.format(amount + 2500);
        }

        summary.classList.remove("d-none");
        summary.textContent = "Siap diproses: " + detail;
        processButton.textContent = "Konfirmasi Berhasil";
        window.setTimeout(function() {
          processButton.textContent = "Konfirmasi Transaksi";
        }, 1800);
      });
    });
  };

  // document ready
  $(document).ready(function() {
    
    initPreloader();
    initCatalog();
    initSwiper();
    initProductQty();
    initJarallax();
    initChocolat();
    initPageIntro();
    initHeroTitle();
    initQafTicker();
    initQafLogin();
    initMenuInteractions();
    initVibrantSectionAnimations();
    initShoppingGuideAnimation();
    initServiceInfoDetails();
    initLayananJasa();

  }); // End of a document

})(jQuery);
(function () {
  var QAF_WA_NUMBER = "6289523248631";
  var qafLastServiceStatus = "";

  function qafAmbilAngka(teks) {
    var digits = String(teks || "").replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  }

  function qafFormatRupiah(angka) {
    return "Rp " + (Number(angka) || 0).toLocaleString("id-ID");
  }

  function qafBersih(teks) {
    return String(teks || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function qafFormatAdminMessage(card) {
    if (!card) return "Halo Admin Qaf, ada pesanan baru untuk disiapkan.";

    var titleEl = card.querySelector(".qaf-history-title");
    var dateEl = card.querySelector(".qaf-history-date");
    var detailsEl = card.querySelector(".qaf-history-details");
    var itemEls = card.querySelectorAll(".qaf-history-items li");
    var totalEl = card.querySelector(".qaf-history-total");

    var titleText = qafBersih(titleEl ? titleEl.textContent : "");
    var dateText = qafBersih(dateEl ? dateEl.textContent : "");
    var detailsText = qafBersih(detailsEl ? detailsEl.textContent : "");
    var totalText = qafBersih(totalEl ? totalEl.textContent : "");
    var rawAll = qafBersih(card.innerText || card.textContent || "");

    var lines = ["*PESANAN BARU - QAF MARKET*"];

    // 1. ID Pesanan & Pemesan dari title (contoh: "Pesanan QAF-MWU0NL9D · naila")
    var mId = titleText.match(/Pesanan\s+([A-Z0-9-]+)/i);
    if (mId) {
      lines.push("ID Pesanan: " + mId[1]);
    }

    var titleParts = titleText.split(/\s*[·•|]\s*/);
    var namaPemesan = titleParts.length > 1 ? qafBersih(titleParts.slice(1).join(" ")) : "";

    var detailParts = detailsText
      ? detailsText.split(/\s*[·•|]\s*/).map(function (p) {
          return qafBersih(p);
        }).filter(Boolean)
      : [];

    var roleText = "";
    var hpText = "";
    var penerimaText = "";
    var pengirimanText = "";
    var asramaText = "";
    var kelasText = "";
    var bayarText = "";
    var catatanText = "";

    for (var i = 0; i < detailParts.length; i++) {
      var seg = detailParts[i];

      if (/^(Wali\s+Santri|Santri|Guru|Staff|Umum)$/i.test(seg) && !roleText) {
        roleText = seg;
      } else if (/^(\+?62\d{8,14}|08\d{8,13})$/.test(seg.replace(/[\s-]/g, "")) && !hpText) {
        hpText = seg.replace(/[\s-]/g, "");
      } else if (/^Penerima\s*:/i.test(seg) && !penerimaText) {
        penerimaText = qafBersih(seg.replace(/^Penerima\s*:\s*/i, ""));
      } else if (/^(Antar\s+ke\s+.+|Ambil\s+di\s+.+)$/i.test(seg) && !pengirimanText) {
        pengirimanText = seg;
      } else if (/^Asrama\s*:/i.test(seg) && !asramaText) {
        asramaText = seg;
      } else if (/^Kelas\s*:/i.test(seg) && !kelasText) {
        kelasText = seg;
      } else if (/^Pembayaran\s*:/i.test(seg) && !bayarText) {
        bayarText = qafBersih(seg.replace(/^Pembayaran\s*:\s*/i, ""));
      } else if (/^(Catatan|Cat\.|Notes?)\s*:/i.test(seg) && !catatanText) {
        catatanText = qafBersih(seg.replace(/^(Catatan|Cat\.|Notes?)\s*:\s*/i, ""));
      }
    }

    if (namaPemesan) {
      lines.push("Pemesan: " + namaPemesan + (roleText ? " (" + roleText + ")" : ""));
    }
    if (penerimaText) {
      lines.push("Penerima: " + penerimaText);
    }
    if (hpText) {
      lines.push("No. HP: " + hpText);
    }
    if (dateText) {
      lines.push("Waktu: " + dateText);
    }
    if (pengirimanText) {
      lines.push("Pengiriman: " + pengirimanText);
    }

    var lokasiArr = [];
    if (asramaText) lokasiArr.push(asramaText);
    if (kelasText) lokasiArr.push(kelasText);
    if (lokasiArr.length > 0) {
      lines.push("Lokasi: " + lokasiArr.join(" · "));
    }

    if (bayarText) {
      lines.push("Pembayaran: " + bayarText);
    }

    // 2. Daftar Barang dari .qaf-history-items li
    lines.push("");
    lines.push("*Daftar Barang:*");
    if (itemEls && itemEls.length > 0) {
      for (var j = 0; j < itemEls.length; j++) {
        var it = qafBersih(itemEls[j].textContent);
        if (it) lines.push("- " + it);
      }
    } else {
      lines.push("- " + rawAll);
    }

    // 3. Catatan (jika ada di kartu atau di input catatan)
    if (!catatanText) {
      var mCatRaw = rawAll.match(/(?:^|[·•|\s])(?:Catatan|Cat\.|Notes?)\s*:\s*([\s\S]+?)(?=\s*(?:Total\s*:|$))/i);
      if (mCatRaw && mCatRaw[1]) {
        catatanText = qafBersih(mCatRaw[1]);
      }
    }
    if (catatanText) {
      lines.push("");
      lines.push("Catatan: " + catatanText);
    }

    // 4. Total
    var totalClean = qafBersih(totalText.replace(/^Total\s*:\s*/i, ""));
    if (!totalClean) {
      var mTot = rawAll.match(/Total\s*:\s*(Rp\s*[\d.,]+|Harga\s+konfirmasi)/i);
      if (mTot) totalClean = qafBersih(mTot[1]);
    }
    if (totalClean) {
      lines.push("");
      lines.push("*Total: " + totalClean + "*");
    }

    return lines.join("\n");
  }

  function qafAttachWaButtons() {
    var list = document.getElementById("orderHistoryList");
    if (!list) return;

    var cards = list.querySelectorAll(".qaf-history-card, .order-card, article");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var btn = card.querySelector(".qaf-wa-send-btn");

      if (!btn) {
        btn = document.createElement("a");
        btn.className = "qaf-wa-send-btn";
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
        btn.textContent = "Kirim Pesanan ke WA";
        btn.style.display = "inline-block";
        btn.style.marginTop = "10px";
        btn.style.padding = "8px 14px";
        btn.style.borderRadius = "8px";
        btn.style.backgroundColor = "#25D366";
        btn.style.color = "#ffffff";
        btn.style.fontWeight = "600";
        btn.style.textDecoration = "none";
        card.appendChild(btn);
      }

      var text = qafFormatAdminMessage(card);
      btn.href = "https://wa.me/" + QAF_WA_NUMBER + "?text=" + encodeURIComponent(text);
    }
  }

  function qafScrollKeRiwayat(card) {
    var list = document.getElementById("orderHistoryList");
    var target = card || list;
    if (!target) return;

    setTimeout(function () {
      target.scrollIntoView({ behavior: "smooth", block: "center" });

      if (card) {
        var oldBg = card.style.backgroundColor;
        var oldTransition = card.style.transition;
        card.style.transition = "background-color 0.4s ease";
        card.style.backgroundColor = "#fef9c3";
        setTimeout(function () {
          card.style.backgroundColor = oldBg || "#ffffff";
          card.style.transition = oldTransition || "";
        }, 1400);
      }
    }, 180);
  }

  function qafCariStatusSiapDiproses() {
    var els = document.querySelectorAll("div, p, span");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.children.length > 2) continue;
      var txt = qafBersih(el.innerText || el.textContent || "");
      if (/^siap\s+diproses\s*:/i.test(txt) && txt.length < 250) {
        return el;
      }
    }
    return null;
  }

  function qafParseStatusLayanan(statusText) {
    var bersih = statusText.replace(/^siap\s+diproses\s*:\s*/i, "").trim();
    var parts = bersih.split(/\s*[·•|]\s*/);

    var layanan = parts[0] ? parts[0].trim() : "Layanan Transaksi";
    var total = 0;
    var detailParts = [];

    for (var i = 1; i < parts.length; i++) {
      var p = parts[i].trim();
      if (!p) continue;
      if (/^total\s*:/i.test(p)) {
        total = qafAmbilAngka(p);
      } else {
        detailParts.push(p);
      }
    }

    if (!total && parts[1]) {
      total = qafAmbilAngka(parts[1]);
    }

    return {
      rawStatus: statusText,
      layanan: layanan,
      detail: detailParts.join(" • "),
      total: total
    };
  }

  function qafMasukKeRiwayatLayanan(info) {
    var list = document.getElementById("orderHistoryList");
    if (!list) return;
    if (list.querySelector("[data-qaf-service-key='" + info.rawStatus + "']")) return;

    var now = new Date();
    var jam = String(now.getHours()).padStart(2, "0") + "." + String(now.getMinutes()).padStart(2, "0");
    var kode = "QAF-JASA-" + String(now.getTime()).slice(-5);

    var card = document.createElement("article");
    card.className = "qaf-history-card order-card";
    card.setAttribute("data-qaf-service-key", info.rawStatus);
    card.style.border = "1px solid #e5e7eb";
    card.style.borderRadius = "10px";
    card.style.padding = "14px";
    card.style.marginBottom = "12px";
    card.style.backgroundColor = "#ffffff";

    var itemText = info.layanan + (info.detail ? " • " + info.detail : "") + " × 1 · " + qafFormatRupiah(info.total);

    card.innerHTML =
      "<div class='qaf-history-header'>" +
        "<h3 class='qaf-history-title'>Pesanan " + kode + " · Layanan Jasa</h3>" +
        "<time class='qaf-history-date'>" + jam + "</time>" +
      "</div>" +
      "<p class='qaf-history-details'>Pembayaran: Konfirmasi Admin</p>" +
      "<ul class='qaf-history-items'><li>" + itemText + "</li></ul>" +
      "<strong class='qaf-history-total'>Total: " + qafFormatRupiah(info.total) + "</strong>";

    list.prepend(card);
    qafAttachWaButtons();
    qafScrollKeRiwayat(card);
  }

  function qafPantauLayananJasa() {
    var statusEl = qafCariStatusSiapDiproses();
    if (!statusEl) return;

    var current = qafBersih(statusEl.innerText || statusEl.textContent || "");
    if (!current || current === qafLastServiceStatus) return;

    qafLastServiceStatus = current;
    var parsed = qafParseStatusLayanan(current);
    qafMasukKeRiwayatLayanan(parsed);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", qafAttachWaButtons);
  } else {
    qafAttachWaButtons();
  }

  var orderList = document.getElementById("orderHistoryList");
  if (orderList && typeof MutationObserver !== "undefined") {
    var obs = new MutationObserver(function () {
      qafAttachWaButtons();
    });
    obs.observe(orderList, { childList: true, subtree: true });
  }

  document.addEventListener(
    "click",
    function (e) {
      var waBtn = e.target.closest(".qaf-wa-send-btn");
      if (waBtn) {
        var parentCard = waBtn.closest(".qaf-history-card, .order-card, article");
        if (parentCard) {
          var freshText = qafFormatAdminMessage(parentCard);
          waBtn.href = "https://wa.me/" + QAF_WA_NUMBER + "?text=" + encodeURIComponent(freshText);
        }
      }
      setTimeout(qafPantauLayananJasa, 120);
    },
    true
  );

  setInterval(qafPantauLayananJasa, 350);
  var qafDraftPenerima = "";
  var qafDraftCatatan = "";

  function qafBacaPenerimaSekarang() {
    var els = document.querySelectorAll(
      "[id^='orderRe'], [name^='receivi'], [name^='recipie']"
    );
    var vals = [];
    for (var i = 0; i < els.length; i++) {
      var v = qafBersih(els[i].value || "");
      if (v && vals.indexOf(v) === -1) {
        vals.push(v);
      }
    }
    return vals.join(" - ");
  }

  function qafBacaCatatanSekarang() {
    var els = document.querySelectorAll(
      "#orderNotes, [id^='orderNo'], [name='notes'], [name*='note']"
    );
    for (var i = 0; i < els.length; i++) {
      var v = qafBersih(els[i].value || "");
      if (v) return v;
    }
    return "";
  }

  function qafTangkapInputForm() {
    var p = qafBacaPenerimaSekarang();
    var c = qafBacaCatatanSekarang();
    if (p) qafDraftPenerima = p;
    if (c) qafDraftCatatan = c;
  }

  function qafSinkronkanFieldKeKartu() {
    var list = document.getElementById("orderHistoryList");
    if (!list) return;

    var cards = list.querySelectorAll(".qaf-history-card, .order-card, article");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var txt = qafBersih(card.innerText || card.textContent || "");
      var detailsEl = card.querySelector(".qaf-history-details") || card;

      if (qafDraftPenerima && !/penerima\s*:/i.test(txt)) {
        var spanP = document.createElement("span");
        spanP.className = "qaf-injected-penerima";
        spanP.textContent = " · Penerima: " + qafDraftPenerima;
        detailsEl.appendChild(spanP);
      }

      if (qafDraftCatatan && !/catatan\s*:/i.test(txt)) {
        var pCat = document.createElement("p");
        pCat.className = "qaf-injected-catatan";
        pCat.style.margin = "4px 0 0 0";
        pCat.textContent = "Catatan: " + qafDraftCatatan;
        var btn = card.querySelector(".qaf-wa-send-btn");
        if (btn) {
          card.insertBefore(pCat, btn);
        } else {
          card.appendChild(pCat);
        }
      }
    }
  }

  document.addEventListener("input", qafTangkapInputForm, true);
  document.addEventListener("change", qafTangkapInputForm, true);
  document.addEventListener("pointerdown", qafTangkapInputForm, true);
  document.addEventListener(
    "click",
    function () {
      qafTangkapInputForm();
      setTimeout(function () {
        qafSinkronkanFieldKeKartu();
        qafAttachWaButtons();
      }, 180);
    },
    true
  );
})();