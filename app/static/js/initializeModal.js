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
      // Returning false will make the modal not render
      console.log("Data to parse is this ", data)

      if (!data.product_name) {
        console.log('No product name');
        return false;
      }

      if (data.social_setting == "latest") {
        if (!data.processed_at) {
          console.log('no one bought the item within the lookback look_back_period');
          return false;
        }
        if (!data.first_name || !data.last_name) {
          console.log('first or last name not provided for order');
          return false;
        }
      }

      if (data.social_setting == "purchase") {
        if (!data.qty_from_look_back) {
          console.log('no items were sold within lookback period');
          return false;
        }
      }

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
      // Set up main modal elements
      var modal = document.createElement("div");
      var imageNode = document.createElement("div");
      var specialTextNode = document.createElement("a");
      var timestampTextNode = document.createElement("p");
      var productNameTextNode = document.createElement("a");

      modal.id = "modal";
      imageNode.id = "product-image";
      specialTextNode.id = "modal-special-text";
      timestampTextNode.id = "timestamp-text";
      productNameTextNode.id = "product-name-text";

      document.body.appendChild(modal);
      modal.appendChild(imageNode);
      modal.appendChild(specialTextNode);
      modal.appendChild(timestampTextNode);
      modal.appendChild(productNameTextNode);

      api.renderModalText(settings); // Description
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
    renderModalText: function (data) {
      var modalSpecialText = "";
      var timestampText = "";
      var productNameText = data.product_name;

      var specialTextNode = document.getElementById("modal-special-text");
      var timestampTextNode = document.getElementById("timestamp-text");
      var imageNode = document.getElementById("product-image");
      var productNameTextNode = document.getElementById("product-name-text");

      var processedAtDateTime = new Date(data.processed_at);
      var nowDateTime = new Date();

      // ------------- Calculate time since processed --------------------- //
      var differenceDateTime = (nowDateTime-processedAtDateTime)/1000/60/60/24;
      var differenceUnits = "";
      console.log(differenceDateTime);

      if (differenceDateTime * 24 < 1) {
        differenceDateTime *= (24*60);
        differenceUnits = "minutes";
        console.log("Difference less than 1 hour. Convert minutes.");
        console.log(differenceDateTime);
      } else if (differenceDateTime < 1) {
        differenceDateTime *= 24;
        differenceUnits = "hours";
        console.log("Difference less than 1 day. Convert hours.");
        console.log(differenceDateTime);
      } else {
        differenceUnits = "days";
        console.log("Difference greater than 1 day. Keep days.");
        console.log(differenceDateTime);
      }
      differenceDateTime = Math.floor(differenceDateTime);
      console.log(differenceDateTime);
      console.log(differenceUnits);

      if (differenceDateTime == 1) {
        differenceUnits.replace("s", "");
      }

      timestampText = differenceDateTime + " " + differenceUnits + " ago"

      var timestampText = document.createTextNode(timestampText);
      timestampTextNode.appendChild(timestampText);

      // --------------- Modal Special Text Logic --------------------------- //

      if (data.social_setting == "latest") {
        var first_name = data.first_name;
        var last_name = data.last_name;
        var province = data.province_code;

        modalSpecialText = first_name + " " + last_name + " purchased a";
      } else {
        // Default to "purchase" social_setting if something goes wrong
        modalSpecialText = data.last_order_qty + " people have purchased this product in the last " + data.look_back_period || "24" + "hours";
      }

      // Only add redirect link if different product
      if (meta.product.id == data.product_id) {
        console.log("Not same product id, so I add redirect link to modal.");
        var productLink = "https://" + data.store_name + "/products/" + data.handle;
        productNameTextNode.href = productLink;
        $("#product-image").wrap($("<a>").attr("href", productLink));

        productNameTextNode.appendChild(document.createTextNode(productNameText));
      }

      specialTextNode.appendChild(document.createTextNode(modalSpecialText));
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
      var text = document.getElementById("modal-special-text");
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
