var ReorderingController = {};
ReorderingController.initTemplate = function (pluginInstance) {
  ReorderingController.pluginInstance = pluginInstance;
};
ReorderingController.constant = {
  qsFtbElement: "#ftb-template",
  qsFtbContainer: ".qs-ftb-container",
  qsFtbQuestion: "#qs-ftb-question",
  keyboardPlugin: 'org.ekstep.keyboard',
  fieldMinWidth: 0.15,
  fieldWidthScale: 1.2
};
ReorderingController.question = undefined;

ReorderingController.getQuestionTemplate = function () {
  return '\
  <div class="screen table" onselectstart="return false">\
  <% if(question.data.question.text.length){ %>\
    <div class="table header">\
    <div class="question table-cell"><%= question.data.question.text %></div>\
    </div>\
  <%}%>\
    <div class="gutter1"></div>\
    <div class="table" id="editor">\
      <textarea class="table-cell" id="tarea" readonly></textarea>\
      <img class="table-cell" id="backspace" onclick="ReorderingController.backspaceClick()" src="<%=ReorderingController.pluginInstance.getAudioIcon("renderer/assets/backspace.png") %>">\
    </div>\
    <div class="gutter2"></div>\
    <div style="margin: auto;" class="tabContainer">\
    \
    <% _.each(_.shuffle(question.data.sentence.tabs),function(val,key){ %>\
      <span onclick="ReorderingController.wordClick(\'w<%= val.id %>\')" class="words-tabs" id="w<%= val.id %>"><%= val.text %></span>\
    <% });%>\
    \
    </div>\
  </div>';
}

/**
 * renderer:questionunit.ftb:handle click event on words.
 * @event renderer:questionunit.ftb:show
 * @memberof org.ekstep.questionunit.ftb
 */
ReorderingController.wordClick = function (id) {
  if (!$("#" + id).hasClass('active')) {
    $("#" + id).addClass('active remove-shadow');
    ReorderingController.pluginInstance.onWordSelect($("#" + id).attr('id'));
  }
};

/**
 * renderer:questionunit.ftb:handle click event on backspace.
 * @event renderer:questionunit.ftb:show
 * @memberof org.ekstep.questionunit.ftb
 */
ReorderingController.backspaceClick = function () {
  ReorderingController.pluginInstance.onBackspaceClick();
};

/**
 * renderer:questionunit.ftb:set state in the text box.
 * @event renderer:questionunit.ftb:show
 * @memberof org.ekstep.questionunit.ftb
 */
ReorderingController.setStateInput = function () {
  var textBoxCollection = $(ReorderingController.constant.qsFtbQuestion).find("input[type=text]");
  _.each(textBoxCollection, function (element, index) {
    $("#" + element.id).val(ReorderingController.question.state.val[index]);
  });
};

/**
 * logs telemetry 
 * @memberof org.ekstep.questionunit.ftb.ReorderingController
 * @param {Object} event js event object
 */
ReorderingController.logTelemetryInteract = function (event) {
  QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.TOUCH, {
    type: QSTelemetryLogger.EVENT_TYPES.TOUCH,
    id: event.target.id
  }); // eslint-disable-line no-undef
};

//# sourceURL=reordering-renderer-Controller.js