/**
 *
 * Question Unit plugin to render a FTB question
 * @class org.ekstep.questionunit.ftb
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Gourav More <gourav_m@tekditechnologies.com>
 */
org.ekstep.questionunitFTB = {};
org.ekstep.questionunitFTB.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.ftb',
  _isContainer: true,
  _render: true,
  _userWords: [],
  /**
   * renderer:questionunit.ftb:showEventListener.
   * @event renderer:questionunit.ftb:show
   * @memberof org.ekstep.questionunit.ftb
   */
  setQuestionTemplate: function () {
    console.log(this._question.data.question);
    ReorderingController.initTemplate(this); // eslint-disable-line no-undef
  },
  /**
   * Listen show event
   * @memberof org.ekstep.questionunit.ftb
   * @param {Object} event from question set.
   */
  preQuestionShow: function (event) {
    this._super(event);
    this._question.template = ReorderingController.getQuestionTemplate(); // eslint-disable-line no-undef
    this._userWords = [];
  },
  /**
   * function to handle tabs(words) onclick event
   * @memberof org.ekstep.questionunit.ftb
   * @param {Object} event from question set.
   */
  onWordSelect: function (id) {
    this._userWords.push({
      id: $("#" + id).attr('id'),
      text: $("#" + id).text().trim()
    });
    $('#tarea').text(_.map(this._userWords, function (w) {
      return w.text;
    }).join(' '));
  },

  /**
   * function to handle backspace onclick event
   * @memberof org.ekstep.questionunit.ftb
   */
  onBackspaceClick: function () {
    var deleted = this._userWords.pop();
    if (deleted) {
      $('#' + deleted.id).removeClass('active remove-shadow');
      $('#tarea').text(_.map(this._userWords, function (w) {
        return w.text;
      }).join(' '));
    }
  },

  /**
   * Listen event after display the question
   * @memberof org.ekstep.questionunit.ftb
   * @param {Object} event from question set.
   */
  postQuestionShow: function (event) { // eslint-disable-line no-unused-vars
    ReorderingController.question = this._question; // eslint-disable-line no-undef

    $(ReorderingController.constant.qsFtbElement).off('click'); // eslint-disable-line no-undef
    $(ReorderingController.constant.qsFtbElement).on('click', '.ans-field', ReorderingController.invokeKeyboard); // eslint-disable-line no-undef

    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
  },
  /**
   * Hides the keyboard
   * @memberof org.ekstep.questionunit.ftb
   * @param {Object} event from question set.
   */
  postHideQuestion: function () {
    EkstepRendererAPI.dispatchEvent("org.ekstep.keyboard:hide");
  },
  /**
   * renderer:questionunit.ftb:evaluateEventListener.
   * @event renderer:questionunit.ftb:evaluate
   * @param {Object} event object from questionset
   * @memberof org.ekstep.questionunit.ftb
   */
  evaluateQuestion: function (event) {
    var telemetryAnsArr = [], //array have all answer
      correctAnswer = false,
      answerArray = [],
      numOfCorrectAns = 0;
    //check for evalution
    //get all text box value inside the class
    // var textBoxCollection = $(ReorderingController.constant.qsFtbQuestion).find("input[type=text]"); // eslint-disable-line no-undef
    // _.each(textBoxCollection, function (element, index) {
    //   answerArray.push(element.value.toLowerCase().trim());
    //   var key = "ans" + index; // eslint-disable-line no-unused-vars
    //   ansObj = {
    //     key: element.value
    //   };
    //   telemetryAnsArr.push(ansObj);
    // });

    var userText = _.map(this._userWords, function (w) {
      return w.text;
    }).join(' ');
    /*istanbul ignore else*/
    if (userText.replace(/[ ]/g, '') === this._question.data.sentence.text.trim().replace(/[ ]/g, '')) { // eslint-disable-line no-undef
      correctAnswer = true;
      numOfCorrectAns = 1;
    }
    // // Calculate partial score
    // var tempCount = 0;
    // _.each(this._question.data.answer, function (ans, index) { // eslint-disable-line no-undef
    //   /*istanbul ignore else*/
    //   if (ans.toLowerCase().trim() == answerArray[index].toLowerCase().trim()) {
    //     tempCount++;
    //   }
    // });

    var partialScore = 1; // (tempCount / this._question.data.answer.length) * this._question.config.max_score; // eslint-disable-line no-undef

    var result = {
      eval: correctAnswer,
      state: {
        val: answerArray
      },
      score: partialScore,
      values: telemetryAnsArr,
      noOfCorrectAns: numOfCorrectAns, //tempCount,
      totalAns: 1
    };

    var callback = event.target;
    /*istanbul ignore else*/
    if (_.isFunction(callback)) {
      callback(result);
    }

    this.saveQuestionState(result.state);

    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, {
      "type": "INPUT",
      "values": telemetryAnsArr
    }); // eslint-disable-line no-undef
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result); // eslint-disable-line no-undef
  }
});
//# sourceURL=ReorderingRendererPlugin.js