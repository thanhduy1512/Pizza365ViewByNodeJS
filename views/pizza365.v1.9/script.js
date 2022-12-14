/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
const gAPI_DRINKS = "http://42.115.221.44:8080/devcamp-pizza365/drinks";
const gAPI_CHECK_VOUCHER_ID =
  "http://42.115.221.44:8080/devcamp-voucher-api/voucher_detail/";
const gAPI_CREATE_ORDER = "http://42.115.221.44:8080/devcamp-pizza365/orders";

const gAPI_DAILY = "http://localhost:8080/campaigns/";
const gAPI_COMBO_MENU = "http://localhost:8080/combomenu";
const gAPI_DRINK_LIST = "http://localhost:8080/drink-list";

var gComboSize;
var gPizzaType = "";
var gSelectedDrink = "";
var gDrinksObj = {};
var gDiscountPercent = 0;

var sizeS = {
  menuName: "S",
  duongKinhCM: 20,
  suongNuong: 2,
  saladGr: 200,
  drink: 2,
  priceVND: 150000,
};
var sizeM = {
  menuName: "M",
  duongKinhCM: 25,
  suongNuong: 4,
  saladGr: 300,
  drink: 3,
  priceVND: 200000,
};
var sizeL = {
  menuName: "L",
  duongKinhCM: 30,
  suongNuong: 8,
  saladGr: 500,
  drink: 4,
  priceVND: 250000,
};

/*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */

$(document).ready(function () {
  onPageLoading();

  $("#menu-combo").on("click", "#btnS", function () {
    gComboSize = sizeS;
    console.log(gComboSize);
    changeBtnColor(0, ["#btnS", "#btnM", "#btnL"]);
  });

  $("#menu-combo").on("click", "#btnM", function () {
    gComboSize = sizeM;
    console.log(gComboSize);
    changeBtnColor(1, ["#btnS", "#btnM", "#btnL"]);
  });

  $("#menu-combo").on("click", "#btnL", function () {
    gComboSize = sizeL;
    console.log(gComboSize);
    changeBtnColor(2, ["#btnS", "#btnM", "#btnL"]);
  });

  $("#btnSeafood").on("click", function () {
    gPizzaType = "Seafood";
    console.log(gPizzaType);
    changeBtnColor(0, ["#btnSeafood", "#btnHawaii", "#btnBacon"]);
  });

  $("#btnHawaii").on("click", function () {
    gPizzaType = "Hawaii";
    console.log(gPizzaType);
    changeBtnColor(1, ["#btnSeafood", "#btnHawaii", "#btnBacon"]);
  });

  $("#btnBacon").on("click", function () {
    gPizzaType = "Bacon";
    console.log(gPizzaType);
    changeBtnColor(2, ["#btnSeafood", "#btnHawaii", "#btnBacon"]);
  });

  $("#select-drink").on("change", function () {
    var vDrink = $("#select-drink").val();
    gSelectedDrink = vDrink;
  });

  $("#btn-send-order").on("click", function () {
    onBtnSendOrderClick();
  });

  $("#btn-create-order").on("click", function () {
    onBtnCreateOrderClick();
  });
});

/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
function onPageLoading() {
  callApiGetDrinksList();
  callApiGetDailyCampaign();
}

function onBtnSendOrderClick() {
  //Get Order Data
  var vOrderObject = {
    fullName: $("#inpFullName").val(),
    email: $("#inpEmail").val(),
    phoneNumber: $("#inpPhoneNumber").val(),
    address: $("#inpAddress").val(),
    message: $("#inpMessage").val(),
    voucherId: $("#inpVoucherId").val(),
  };

  //Validate Order Data
  var vIsValid = validateData(vOrderObject);

  if (vIsValid) {
    callApiCheckVoucherId(vOrderObject.voucherId);
    loadDataToModal(vOrderObject);
    $("#order-confirm-modal").modal("show");
  }
}

function onBtnCreateOrderClick() {
  var vObjectRequest = {
    kichCo: gComboSize.menuName,
    duongKinh: gComboSize.duongKinhCM,
    suon: gComboSize.suongNuong,
    salad: gComboSize.saladGr,
    loaiPizza: gPizzaType,
    idVourcher: $("#inpVoucherId").val(),
    idLoaiNuocUong: gSelectedDrink,
    soLuongNuoc: gComboSize.drink,
    hoTen: $("#inpFullName").val(),
    thanhTien: calcPrice(),
    email: $("#inpEmail").val(),
    soDienThoai: $("#inpPhoneNumber").val(),
    diaChi: $("#inpAddress").val(),
    loiNhan: $("#inpMessage").val(),
  };

  $.ajax({
    url: gAPI_CREATE_ORDER,
    type: "POST",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(vObjectRequest),
    success: function (res) {
      console.log(res.orderId);
      $("#order-confirm-modal").modal("hide");
      $("#order-success-modal").modal("show");
      $("#inp-order-success").val(res.orderId);
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
}
/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình */
function callApiGetDrinksList() {
  $.ajax({
    url: gAPI_DRINK_LIST,
    type: "GET",
    data: "json",
    success: function (res) {
      var resJson = JSON.parse(res);
      console.log(resJson);
      gDrinksObj = resJson;
      loadDrinksToSelect(resJson);
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
}

function callApiCheckVoucherId(paramVoucherId) {
  $.ajax({
    url: gAPI_CHECK_VOUCHER_ID + paramVoucherId,
    type: "GET",
    data: "json",
    async: false,
    success: function (res) {
      console.log(res);
      gDiscountPercent = res.phanTramGiamGia;
    },
    error: function (err) {
      console.log(err.responseText);
      gDiscountPercent = 0;
    },
  });
}

function loadDrinksToSelect(paramArrDrinks) {
  var vSelect = $("#select-drink");
  for (let i = 0; i < paramArrDrinks.length; i++) {
    var vOptionDrink = $("<option/>")
      .text(paramArrDrinks[i].tenNuocUong)
      .val(paramArrDrinks[i].maNuocUong);
    vSelect.append(vOptionDrink);
  }
}

//function update the choosen btn to be green and set other option to orange
function changeBtnColor(paramIndexBtn, paramArrBtn) {
  $(paramArrBtn[paramIndexBtn]).removeClass("btn-warning");
  $(paramArrBtn[paramIndexBtn]).addClass("btn-success");

  paramArrBtn.splice(paramIndexBtn, 1);

  $(paramArrBtn[0]).removeClass("btn-success");
  $(paramArrBtn[0]).addClass("btn-warning");
  $(paramArrBtn[1]).removeClass("btn-success");
  $(paramArrBtn[1]).addClass("btn-warning");
}

function validateData(paramOrderObject) {
  if (gComboSize == null) {
    alert("Choose Combo!");
    return false;
  }
  if (gPizzaType == "") {
    alert("Choose Pizza Type!");
    return false;
  }
  if (paramOrderObject.fullName.trim() == "") {
    alert("Provide Full Name!");
    return false;
  }
  if (paramOrderObject.email.trim() == "") {
    alert("Provide Email!");
    return false;
  }
  if (
    !paramOrderObject.email.includes("@") ||
    !paramOrderObject.email.includes(".") ||
    paramOrderObject.email.includes(" ")
  ) {
    alert("Wrong Email Format!");
    return false;
  }
  if (paramOrderObject.phoneNumber.trim() == "") {
    alert("Provide Phone Number!");
    return false;
  }
  if (!parseInt(paramOrderObject.phoneNumber)) {
    alert("Wrong Phone Number Format!");
    return false;
  }
  if (paramOrderObject.address.trim() == "") {
    alert("Provide Address!");
    return false;
  }
  return true;
}

function loadDataToModal(paramOrderObject) {
  $("#inp-modal-fullname").val(paramOrderObject.fullName);
  $("#inp-modal-email").val(paramOrderObject.email);
  $("#inp-modal-phone").val(paramOrderObject.phoneNumber);
  $("#inp-modal-address").val(paramOrderObject.address);
  $("#inp-modal-message").val(paramOrderObject.message);
  $("#inp-modal-voucher-id").val(paramOrderObject.voucherId);
  var vDiscount = "(No Discount)";
  if (gDiscountPercent !== 0) {
    vDiscount = "(" + gDiscountPercent + "% discount)";
  }
  var vMarkupDetail =
    "Confirm: " +
    paramOrderObject.fullName +
    ", " +
    paramOrderObject.phoneNumber +
    ", " +
    paramOrderObject.address +
    "&#13;&#10;" +
    "Menu: " +
    gComboSize.menuName +
    ", " +
    gComboSize.suongNuong +
    " ribs, " +
    gComboSize.drink +
    " drinks, ..." +
    "&#13;&#10;" +
    "Pizza Type: " +
    gPizzaType +
    ", " +
    "Price: " +
    gComboSize.priceVND.toLocaleString() +
    " vnd, " +
    "Voucher Code: " +
    paramOrderObject.voucherId +
    "&#13;&#10;" +
    "Payment: " +
    calcPrice().toLocaleString() +
    " vnd " +
    vDiscount;
  $("#inp-modal-detail").html(vMarkupDetail);
}

function getDrinkPrice(paramDrink) {
  for (let i = 0; i < gDrinksObj.length; i++) {
    if (gDrinksObj[i].maNuocUong == paramDrink) {
      return gDrinksObj[i].donGia;
    }
  }
}

function calcPrice() {
  var vPrice = gComboSize.priceVND;
  if (gSelectedDrink !== "") {
    vPrice = gComboSize.priceVND + getDrinkPrice(gSelectedDrink);
  }
  if (gDiscountPercent !== 0) {
    vPrice = (vPrice * (100 - gDiscountPercent)) / 100;
  }
  return vPrice;
}

function callApiGetDailyCampaign() {
  $.ajax({
    url: gAPI_DAILY,
    type: "GET",
    success: function (res) {
      $("#daily-campaign").html(res);
    },
    error: function (err) {
      console.log(res.responseText);
    },
  });

  $.ajax({
    url: gAPI_COMBO_MENU,
    type: "GET",
    success: function (res) {
      var resJson = JSON.parse(res);
      loadCardComboMenu(resJson);
    },
    error: function (err) {
      console.log(res.responseText);
    },
  });
}

function loadCardComboMenu(paramMenu) {
  var vCardHead = "";
  for (let i = 0; i < paramMenu.length; i++) {
    if (paramMenu[i].menuSize == "S") {
      vCardHead = "Small";
    } else if (paramMenu[i].menuSize == "M") {
      vCardHead = "Medium";
    } else {
      vCardHead = "Large";
    }
    var vMarkup = `<div class="col-sm-4">
        <div class="card">
          <div
            class="card-header text-white text-center"
            style="background-color: orange"
          >
            <h3>${vCardHead}</h3>
          </div>
          <div class="card-body text-center">
            <ul class="list-group list-group-flush">
              <li class="list-group-item"><b>${
                paramMenu[i].diameter
              }cm</b> Diameter</li>
              <li class="list-group-item"><b>${
                paramMenu[i].ribs
              }</b> Baked Ribs</li>
              <li class="list-group-item"><b>${
                paramMenu[i].salad
              }g</b> Salad</li>
              <li class="list-group-item"><b>${
                paramMenu[i].drinks
              }</b> Drinks</li>
              <li class="list-group-item">
                <h1><b>${paramMenu[i].price.toLocaleString()}</b></h1>
                VNĐ
              </li>
            </ul>
          </div>
          <div class="card-footer text-center">
            <button id="btn${
              paramMenu[i].menuSize
            }" class="btn btn-warning w-100">
              Choose
            </button>
          </div>
        </div>
      </div>`;
    $("#menu-combo").append(vMarkup);
  }
}
