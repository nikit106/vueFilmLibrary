<template lang="pug">
  .content-wrapper
    section
      .container
        h1.ui-title-1 Home
        input(
          type="text"
          placeholder="what we will watch?"
          v-model="taskTitle"
          @keyup.enter="newTask"
        )
        textarea(
          type="text"
          v-model="taskDescription"
          @keyup.enter="newTask"
        )
        .option-list
          input.what-watch--radio(
            type="radio"
            id="radioFilm"
            value="Film"
            v-model="whatWatch"
          )
          label(
            for="radioFilm"
          ) Film
        .option-list
          input.what-watch--radio(
            type="radio"
            id="radioSerial"
            value="Serial"
            v-model="whatWatch"
          )
          label(
            for="radioSerial"
          ) Serial

        .total-time
          .total-time__film(
            v-if="whatWatch ==='Film'"
          )
            span.time-title Hours
            input.time-input(
              type="number"
              v-model="filmHours"
            )
            span.time-title Minutes
            input.time-input(
              type="number"
              v-model="filmMinutes"
            )
            p {{ filmTime }}
          .total-time__serial(
            v-if="whatWatch ==='Serial'"
          )
            span.time-title How many seasons?
            input.time-input(
              type="number"
              v-model="serialSeason"
            )
            span.time-title How many serials?
            input.time-input(
              type="number"
              v-model="serialSeries"
            )
            span.time-title How long is one series? (minutes)
            input.time-input(
              type="number"
              v-model="serialSeriesMinutes"
            )

            p {{serialTime}}

        .tag-list.tag-list--add
          .ui-tag__wrapper(
            @click="tagMenuShow = !tagMenuShow"
          )
            .ui-tag
              span.tag-title Add new
              span.button-close(
                :class="{ active: !tagMenuShow }"
              )

        .tag-list.tag-list--menu(
          v-if="tagMenuShow"
        )
          input.tag-add--input(
            type="text"
            placeholder="New tag"
            v-model="tagTitle"
            @keyup.enter="newTag"
          )
          .button.button-default(
            @click="newTag"
          ) Send
        .tag-list
          transition-group(
            enter-active-class="animated fadeInRight"
            leave-active-class="animated fadeOutDown"
          )
            .ui-tag__wrapper(
              v-for="tag in tags"
              :key="tag.title"
            )
              .ui-tag(
                @click="addTagUsed(tag)"
                :class="{used: tag.use}"
              )
                span.tag-title {{ tag.title }}
                span.button-close(@click="deleteTag(tag.id)")

        .button-list
          .button.button--round.button-primary(
            @click="newTask"
            :disabled="submitStatus==='PENDING'"
          ) Send

</template>

<script>
export default {
  data () {
    return {
      submitStatus: null,
      taskTitle: '',
      taskDescription: '',
      whatWatch: 'Film',
      filmHours: 1,
      filmMinutes: 30,
      serialSeason: 1,
      serialSeries: 11,
      serialSeriesMinutes: 40,
      tagTitle: '',
      tagMenuShow: false,
      tagsUsed: []
    }
  },

  methods: {
    newTag () {
      if (this.tagTitle === '') {
        return
      }
      const tag = {
        title: this.tagTitle,
        use: false
      }
      this.$store.dispatch('newTag', tag)
    },
    deleteTag (id) {
      this.$store.dispatch('delete', id)
        .then(() => {
          this.$store.dispatch('loadTags')
        })
    },
    newTask () {
      if (this.taskTitle === '') {
        return
      }
      let time
      if (this.whatWatch === 'Film') {
        time = this.filmTime
      } else {
        time = this.serialTime
      }
      const task = {
        title: this.taskTitle,
        description: this.taskDescription,
        whatWatch: this.whatWatch,
        time,
        tags: this.tagsUsed,
        completed: false,
        editing: false
      }
      this.$store.dispatch('newTask', task)
      this.taskTitle = ''
      this.taskDescription = ''
      this.tagsUsed = []
      this.serialSeason = 1
      this.serialSeries = 11
      this.serialSeriesMinutes = 40

      for (let i = 0; i < this.tags.length; i++) {
        this.tags[i].use = false
      }
    },
    delete (id) {
      this.$store.dispatch('deleteTag', id)
        .then(() => {
          this.$store.dispatch('loadTags')
        })
    },
    addTagUsed (tag) {
      tag.use = !tag.use
      if (tag.use) {
        this.tagsUsed.push({
          title: tag.title
        })
      } else {
        this.tagsUsed.splice(tag.title, 1)
      }
    },
    getHoursAndMinutes (minutes) {
      let hours = Math.trunc(minutes / 60)
      let min = minutes % 60
      console.log(hours + ' Hours ' + min + ' Minutes')
      return hours + ' Hours ' + min + ' Minutes'
    }
  },
  computed: {
    tags () {
      return this.$store.getters.tags
    },
    filmTime () {
      let min = (this.filmHours * 60) + (this.filmMinutes * 1)
      return this.getHoursAndMinutes(min)
    },
    serialTime () {
      let min = this.serialSeason * this.serialSeries * this.serialSeriesMinutes
      console.log(min)
      return this.getHoursAndMinutes(min)
    }
  }
}
</script>

<style lang="stylus" scoped>
.option-list
  display flex
  .what-watch--radio
    margin-right 6px
    margin-top: 7px
  .label
    margin-right 20px
    &:last-child
      margin-bottom: 0
tag-list
  margin-bottom 20px

.ui-tag__wrapper
  margin-right 18px
  margin-bottom 10px
  &:last-child
    margin-right 0

.ui-tag
  .button-close
      &.active
        transform: rotate(45deg)
  &.used
    background-color: #444ce0
    color #fff
    .button-close
      &:before,
      &:after
        background-color: #fff

.tag-list--menu
  display flex
  justify-content space-between
  align-items center
  margin-bottom: 10px

.tag-add--input
  margin-bottom 0
  margin-right 10px
  height 42px

.total-time
  margin-bottom: 20px
.time-title
  display block
  margin-bottom: 6px
.time-input
  max-width 80px
  margin-right 10xp

.button-list
  display flex
  justify-content flex-end

</style>
