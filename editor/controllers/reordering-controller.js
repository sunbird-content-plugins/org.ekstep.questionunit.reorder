/*
 * Plugin to create reordering question
 * @class org.ekstep.questionunitmftb:reorderingQuestionFormController
 * Amit Dawar <amit.dawar@funtoot.com>
 */
angular.module('reorderingApp', ['org.ekstep.question']).controller('reorderingQuestionFormController', ['$scope', '$rootScope', 'questionServices', function ($scope, $rootScope, questionServices) { // eslint-disable-line no-unused-vars
  $scope.keyboardConfig = {
    keyboardType: 'Device',
    customKeys: []
  };
  $scope.configuration = {
    'questionConfig': {
      'isText': true,
      'isImage': true,
      'isAudio': true,
      'isHint': false
    }
  };
  $scope.reorderingFormData = {
    question: {
      text: ''
    },
    sentence: {
      text: "",
      tabs: []
    }
  };
  angular.element('.reorderingQuestionBox').on('change', function () {
    $scope.reorderingFormData.question.text = this.value;
  });
  $scope.updateSentence = function () {
    var sentence = $scope.reorderingFormData.sentence.text;
    var nonAlphaNum = sentence.match(/[^a-zA-Z0-9\n ]/g);
    _.each(nonAlphaNum, function (t) {
      var exp = new RegExp('\\' + t, 'g');
      sentence = sentence.replace(exp, ' ' + t);
    });
    $scope.reorderingFormData.sentence.tabs = [];
    var words = sentence.split(' ');
    _.each(words, function (w, i) {
      if (w.length > 0) {
        $scope.reorderingFormData.sentence.tabs.push({
          text: w,
          id: i
        });
      }
    });
  };
  angular.element('.reorderingQuestionBox').on('focus', function () {
    $scope.generateTelemetry({
      type: 'TOUCH',
      id: 'input',
      target: {
        id: 'questionunit-ftb-question',
        ver: '',
        type: 'input'
      }
    })
  });
  $scope.init = function () {
    /**
     * editor:questionunit.reordering:call form validation.
     * @event org.ekstep.questionunit.reordering:validateform
     * @memberof org.ekstep.questionunit.reordering.horizontal_controller
     */
    EventBus.listeners['org.ekstep.questionunit.ftb:validateform'] = [];
    $scope.ftbPluginInstance = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.questionunit.ftb");
    ecEditor.addEventListener('org.ekstep.questionunit.ftb:validateform', function (event, callback) {
      var validationRes = $scope.formValidation();
      callback(validationRes.isValid, validationRes.formData);
    }, $scope);
    /**
     * editor:questionunit.ftb:call form edit the question.
     * @event org.ekstep.questionunit.ftb:editquestion
     * @memberof org.ekstep.questionunit.ftb.horizontal_controller
     */
    EventBus.listeners['org.ekstep.questionunit.ftb:editquestion'] = [];
    ecEditor.addEventListener('org.ekstep.questionunit.ftb:editquestion', $scope.editFtbQuestion, $scope);
    //its indicating the controller is loaded in question unit
    ecEditor.dispatchEvent("org.ekstep.questionunit:ready");
  }
  /**
   * check form validation
   * @memberof org.ekstep.questionunit.ftb.horizontal_controller
   * @returns {Object} question data.
   */
  $scope.formValidation = function () {
    var ftbFormQuestionText, formValid, formConfig = {};
    $scope.submitted = true;
    ftbFormQuestionText = $scope.reorderingFormData.question.text;
    ftbFormSentenceText = $scope.reorderingFormData.sentence.text;
    formValid = (ftbFormQuestionText.length > 0) && (ftbFormSentenceText.length > 0);
    $('.reorderingQuestionBox').removeClass("ck-error");
    $('.sentenceBox').removeClass("ck-error");
    if (formValid) {
      formConfig.isValid = true;
      formConfig.formData = $scope.reorderingFormData;
      $('.reorderingQuestionBox').removeClass("ck-error");
      $('.sentenceBox').removeClass("ck-error");
    } else {
      formConfig.isValid = false;
      formConfig.formData = $scope.reorderingFormData;
      if (ftbFormQuestionText.length === 0)
        $('.reorderingQuestionBox').addClass("ck-error");
      if (ftbFormSentenceText.length === 0)
        $('.sentenceBox').addClass("ck-error");
    }
    return formConfig;
  }

  /**
   * Helper function to generate telemetry event
   * @param {Object} data telemetry data
   */
  $scope.generateTelemetry = function (data) {
    if (data) {
      data.plugin = data.plugin || {
        "id": $scope.ftbPluginInstance.id,
        "ver": $scope.ftbPluginInstance.ver
      }
      data.form = data.form || 'question-creation-ftb-form';
      questionServices.generateTelemetry(data);
    }
  }
}]);
//# sourceURL=reordering-controller-editor.js