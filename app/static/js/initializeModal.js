// 1. StoreSettings data
// 1a. Product Last Ordered 23 hours old
// 1b. # of customers who ordered
// mystore.shopify.com/120392
// { lastName: 'Liou' }
// storesettings


(function () {
  //Logic for the modal library
  var api = {
    start: function () {
      //Get the *.myshopify.com domain
      var shop = Shopify.shop;
      var product = meta.product.id;
      api.fetchSettingsFromAPI(shop, product)
    },
    fetchSettingsFromAPI: function (shop, product) {
      var url = 'https://protected-reef-37693.herokuapp.com/api/modal/' + shop + '/' + product
      fetch(url)
      .then(function(response) {
        response.json().then(function(data) {
          if (!data || !api.validateData(data)) {
            return;
          }
          var settings = data;
          api.renderModal(settings)
        });
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    },
    validateData: function(data) {
      // Various checks to ensure a valid modal is rendered
      console.log("hello");
      console.log(data);

      return true;
    },
    detectMobile: function () {
      // not used for now
      if(window.innerWidth <= 800 && window.innerHeight <= 600) {
        return true;
      } else {
        return false;
      }
    },
    modalAnimation: function () {
      $(document).ready(function() {
        $("#modal").animate({"opacity": "1"},3000);
      });
    },
    renderModal: function(settings) {
      // Set up 3 main elements
      var modal = document.createElement("div");
      var imageNode = document.createElement("div");
      var textNode = document.createElement("a");
      modal.id = "modal";
      imageNode.id = "product-image";
      textNode.id = "modal-text";

      document.body.appendChild(modal);
      modal.appendChild(imageNode);
      modal.appendChild(textNode);
      api.renderText(settings); // Description
      api.renderImage(settings.main_image_url); // adding product image
      api.renderClose(); // Make the x close button
      api.addStyles(); // Add styles
      api.modalAnimation();
    },
    renderImage: function(imageUrl) {
      var img = $('<img id="image">');
      img.attr('src', imageUrl);
      img.appendTo('#product-image');
    },
    renderText: function (data) {
      var displayData = "";
      var textNode = document.getElementById("modal-text");
      var imageNode = document.getElementById("product-image");

      console.log("Data to parse is this ", data)

      if (data.social_setting = "latest") {
        displayData = data.last_order_qty || "87" + " people have purchased this product in the last " + data.look_back_period || "24" + "hours"
      }
      else {
        // Default to "purchase" social_setting
        let first_name = data.first_name || "John";
        let last_name = data.last_name || "Doe";
        let province = data.province_code || "TX";

        displayData = first_name + " " + last_name + " from " + province + " just bought this item!"
      }

      var linkText = document.createTextNode(displayData);
      var productLink = "https://" + data.store_name + "/products/" + data.handle;
      textNode.appendChild(linkText);
      textNode.href = productLink;
      $("#product-image").wrap($("<a>").attr("href", productLink));
    },
    renderClose: function () {
      var close = document.createElement("span");
      var x = document.createTextNode("x");
      close.appendChild(x)
      close.id = "close"
      var modal = document.getElementById("modal");
      modal.appendChild(close)
      $(function() {
        $("#close").click(function() {
          $("#modal").animate({"opacity": "0"},800);
        });
      });
    },
    addStyles: function () {
      var modal = document.getElementById("modal");
      var image = document.getElementById("product-image");
      var text = document.getElementById("modal-text");
      var close = document.getElementById("close");

      var modalStyles = {
        width: "270px",
        height: "80px",
        display: "block",
        position: "fixed",
        border: "1px solid black",
        bottom: "5%",
        left: "5%",
        backgroundColor: "white",
        boxShadow: "0px 0px 0.3px 0.3px black",
        opacity: "0"
      }

      var imageStyles = {
        width: "25%",
        position: "relative",
        margin: "5px 5px 20px 10px"
      }

      var textStyles = {
        position: "absolute",
        width: "60%",
        top: "0",
        right: "20px"
      }

      var closeStyles = {
        position: "absolute",
        top: "1px",
        right: "5px",
        cursor: "pointer"
      }

      for (var key in modalStyles) {
        modal.style[key] = modalStyles[key];
      }
      for (var key in imageStyles) {
        image.style[key] = imageStyles[key]
      }
      for (var key in textStyles) {
        text.style[key] = textStyles[key]
      }
      for (var key in closeStyles) {
        close.style[key] = closeStyles[key]
      }
    }
  }
  //Starting it off
  if (meta.page.pageType === "product") {
    console.log("This is a product good to go good to go")
    api.start();
  }
}());
