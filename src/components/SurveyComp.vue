<template>
  <div id="survey" class="auth">
    <div class="content">
      <h2 class="brown">
        {{question.question}} ({{currentQuestionIndex + 1}}/{{surveyLength}})
      </h2>
      <button class="answerButton" @click="vote(answer, answerindex)" v-for="(answer, answerindex) in question.answers" :key="answer.msg">
        {{answer.msg}}
      </button>
    </div>
    <img class="questionPic" :src="'/images/' + question.img" alt="">
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
    vote: function (answer, answerindex) {
      let answerPlayload = {
        answer,
        answerindex
      }
      if (this.currentQuestionIndex < this.surveyLength - 1) {
        this.$store.commit('registerAnswer', answerPlayload)
        this.currentQuestionIndex++
      } else {
        this.$store.commit('registerAnswer', answerPlayload)
        this.$store.dispatch('finishSurvey')
        this.$store.commit('setComponent', 'result-comp')
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
