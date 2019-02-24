<template>
  <div id="survey">
    <!-- {{question.question}} -->
    <!-- {{question.img}} -->
    <img class="questionPic" :src="'/images/' + question.img" alt="">
    <div class="content">
      <h2>
        {{question.question}} ({{currentQuestionIndex + 1}}/{{surveyLength}})
      </h2>
      <button @click="vote(answerindex)" v-for="(answer, answerindex) in question.answers" :key="answer">
        {{answer}}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SurveyComp',
  data () {
    return {
      currentQuestionIndex: 0,
      result: []
    }
  },
  methods: {
    vote: function (answerindex) {
      if (this.currentQuestionIndex < this.surveyLength) {
        this.result.push([this.currentQuestionIndex, answerindex])
        this.currentQuestionIndex++
      } else {

      }
    }
  },
  computed: {
    question: function () {
      return this.$store.getters.getQueston(this.currentQuestionIndex)
    },
    surveyLength: function () {
      return this.$store.getters.getQuestonLength
    }
  }
}
</script>
