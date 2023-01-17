<template>
  <el-scrollbar style="height: 100%">
    <div class="mainPage">
      <div>
        <el-row>
          <el-col :span="19">
            <n-h1 prefix="bar" class="videoTitle" type="error">{{ videoDetails.videoName }} 🎞️</n-h1>
            <el-tag
              v-for="tag in videoDetails.tags"
              :key="tag.id"
              style="margin-right: 10px; margin-bottom: 10px; border-radius: 10px"
              size="large"
              :disable-transitions="false"
              type="info"
              :hit="true"
              @close="handleTagClose(videoDetails.videoID, tag)"
            >
              <strong>
                {{ tag.tag_name }}
              </strong>
            </el-tag>
            <el-card class="videoInfoCard">
              <p>
                <strong style="margin-right: 5px">简介：</strong>
                {{ videoDetails.intro }}
              </p>
              <el-divider>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-a-tvhomeappliances"></use>
                </svg>
              </el-divider>
              <div class="tableItem">
                <p style="display: inline; margin-right: 5px"><strong>导演：</strong></p>
                <p
                  v-for="(director, index) in videoDetails.directorList.list"
                  :key="director.id"
                  style="display: inline"
                >
                  {{ director.name }}
                  <el-divider v-if="index != videoDetails.directorList.list.length - 1" direction="vertical" />
                </p>
              </div>

              <div class="tableItem">
                <p style="display: inline; margin-right: 5px"><strong>编剧：</strong></p>
                <p v-for="(author, index) in videoDetails.authorList.list" :key="author.id" style="display: inline">
                  {{ author.name }}
                  <el-divider v-if="index != videoDetails.authorList.list.length - 1" direction="vertical" />
                </p>
              </div>

              <div class="tableItem">
                <p style="display: inline; margin-right: 5px"><strong>演员：</strong></p>
                <p v-for="(actor, index) in videoDetails.actorList.list" :key="actor.id" style="display: inline">
                  {{ actor.name }}
                  <el-divider v-if="index != videoDetails.actorList.list.length - 1" direction="vertical" />
                </p>
              </div>

              <div class="tableItem">
                <p style="display: inline; margin-right: 5px"><strong>其他人员：</strong></p>
                <p v-for="(other, index) in videoDetails.otherList.list" :key="other.id" style="display: inline">
                  {{ other.name }}
                  <el-divider v-if="index != videoDetails.otherList.list.length - 1" direction="vertical" />
                </p>
              </div>

              <div class="tableItem">
                <p style="display: inline; margin-right: 5px"><strong>上映日期：</strong></p>
                <p style="display: inline">
                  {{ videoDetails.releaseDate }}
                </p>
              </div>

              <div class="tableItem">
                <p style="display: inline; margin-right: 5px"><strong>相关链接：</strong></p>
                <el-link style="display: inline" :href="videoDetails.url" target="_blank">
                  {{ videoDetails.url }}
                </el-link>
              </div>

              <el-divider>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-a-computerstech"></use>
                </svg>
              </el-divider>
              <el-row>
                <el-col :span="8">
                  <div class="tableItem">
                    <p style="display: inline; margin-right: 5px"><strong>帧长：</strong></p>
                    <p style="display: inline">{{ mediaInfo.lengthInFrames }} Bit</p>
                  </div>

                  <div class="tableItem">
                    <p style="display: inline; margin-right: 5px"><strong>帧率：</strong></p>
                    <p style="display: inline">{{ mediaInfo.frameRate.toFixed(0) }} Hz</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="tableItem">
                    <p style="display: inline; margin-right: 5px"><strong>时长：</strong></p>
                    <p style="display: inline">{{ mediaInfo.durationStr }}</p>
                  </div>

                  <div class="tableItem">
                    <p style="display: inline; margin-right: 5px"><strong>尺寸：</strong></p>
                    <p style="display: inline">{{ mediaInfo.width }} × {{ mediaInfo.height }}</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="tableItem">
                    <p style="display: inline; margin-right: 5px"><strong>频道：</strong></p>
                    <p style="display: inline" v-if="mediaInfo.audioChannel == 2">
                      {{ mediaInfo.audioChannel }} （双声道）
                    </p>
                    <p style="display: inline" v-if="mediaInfo.audioChannel == 1">
                      {{ mediaInfo.audioChannel }} （单声道）
                    </p>
                  </div>
                  <div class="tableItem">
                    <p style="display: inline; margin-right: 5px"><strong>音频采样率：</strong></p>
                    <p style="display: inline">{{ (mediaInfo.sampleRate / 1000).toFixed(3) }} kHz</p>
                  </div>
                </el-col>
              </el-row>

              <el-divider>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-a-stationerycraft"></use>
                </svg>
              </el-divider>
              <div>
                <el-button
                  size="large"
                  style="border-radius: 25px"
                  class="playButton"
                  @click="openFile(videoDetails.videoPath)"
                >
                  <svg class="icon" aria-hidden="true">
                    <use color="white" xlink:href="#yw-icon-arrow-right-filling"></use>
                  </svg>
                  <strong style="color: white; margin-left: 5px">默认播放</strong>
                </el-button>
                <el-button
                  v-if="videoDetails.followed == 0"
                  size="large"
                  style="border-radius: 25px"
                  color="#fa3841"
                  @click="changeFollowed"
                >
                  <svg class="icon" aria-hidden="true">
                    <use color="white" xlink:href="#yw-icon-favorite-filling"></use>
                  </svg>
                  <strong style="color: white; margin-left: 5px">收藏</strong>
                </el-button>
                <el-button
                  v-if="videoDetails.followed == 1"
                  size="large"
                  style="border-radius: 25px"
                  color="#e7e7e7"
                  @click="changeFollowed"
                >
                  <svg class="icon" aria-hidden="true">
                    <use color="#99999b" xlink:href="#yw-icon-favorite-filling"></use>
                  </svg>
                  <strong style="color: #99999b; margin-left: 5px">已收藏</strong>
                </el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-image :src="videoDetails.videoCover" class="mainpic" fit="cover" />
            <el-card class="videoRateCard">
              <el-rate v-model="videoDetails.videoScore" disabled />
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-col :span="20">
            <video-player
              :src="videoDetails.videoPath"
              class="video-player vjs-big-play-centered"
              controls
              :loop="true"
              :tracks="videoDetails.tracks"
              :volume="0.6"
              :playback-rates="[0.5, 1.0, 1.5, 2.0]"
            ></video-player>
            <el-image></el-image>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { NButton, NSpace, NH1 } from 'naive-ui'

const { shell } = require('electron')

export default {
  components: {
    NButton,
    NSpace,
    NH1
  },
  inject: ['refresh'],
  data() {
    return {
      videoDetails: {
        vc_id: 0,
        videoID: 0,
        videoName: '',
        videoCover: '',
        videoPath: '',
        videoScore: 0,
        intro: '',
        followed: 0,
        releaseDate: '',
        url: '',
        tags: [
          {
            id: 0,
            tag_name: ''
          }
        ],
        directorList: {
          roleID: 1,
          roleName: '导演',
          list: [
            {
              id: 0,
              name: '',
              profile: '',
              birthday: '',
              followed: 0
            }
          ]
        },
        authorList: {
          roleID: 2,
          roleName: '编剧',
          list: [
            {
              id: 0,
              name: '',
              profile: '',
              birthday: '',
              followed: 0
            }
          ]
        },
        actorList: {
          roleID: 3,
          roleName: '演员',
          list: [
            {
              id: 0,
              name: '',
              profile: '',
              birthday: '',
              followed: 0
            }
          ]
        },
        otherList: {
          roleID: 4,
          roleName: '其他',
          list: [
            {
              id: 0,
              name: '',
              profile: '',
              birthday: '',
              followed: 0
            }
          ]
        },
        tracks: [
          {
            src: 'I:\\JiLeFile\\subtitle\\Chinese Simplified.vtt',
            kind: 'captions',
            srclang: 'en',
            label: 'English'
          }
        ]
      },
      mediaInfo: {
        lengthInFrames: 0,
        frameRate: 0,
        duration: 0,
        width: 0,
        height: 0,
        audioChannel: 0,
        sampleRate: 0,
        durationStr: ''
      }
    }
  },
  created() {
    var videoID = 28
    this.initVideoDetails(videoID)
    this.initMediaInfo(videoID)
  },
  methods: {
    ...mapActions('video-col', ['getVideoDetails', 'changeFollowedState', 'getVideoMediaInfo']),

    initVideoDetails(videoID) {
      //重置表单信息
      this.videoDetails = this.$options.data().videoDetails
      this.getVideoDetails({ videoID }).then((response) => {
        //处理初始表单
        this.videoDetails.vc_id = response.data.vc_id
        this.videoDetails.videoID = response.data.videoID
        this.videoDetails.videoName = response.data.videoName
        this.videoDetails.videoPath = response.data.videoPath
        this.videoDetails.videoCover = response.data.videoCover
        this.videoDetails.videoScore = response.data.videoScore
        if (response.data.intro == '' || response.data.intro == null) {
          this.videoDetails.intro = '暂无简介'
        } else {
          this.videoDetails.intro = response.data.intro
        }
        this.videoDetails.followed = response.data.followed
        var date = new Date(response.data.releaseDate)
        //date.getMonth获取到的是0~11中的数字，所以格式化时要对月份单独+1
        this.videoDetails.releaseDate = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
        this.videoDetails.tags = response.data.tags
        if (response.data.url == null || response.data.url == '') {
          this.videoDetails.url = '暂无'
        } else {
          this.videoDetails.url = response.data.url
        }

        var pList = response.data.personList
        var directors = []
        var authors = []
        var actors = []
        var others = []
        // console.log(this.videoDetails.tags)
        //处理角色表单数据
        for (var i = 0; i < pList.length; i++) {
          // console.log(pList[i])
          var person = pList[i]
          if (person.roleID == 1) {
            directors.push(person)
          } else if (person.roleID == 2) {
            authors.push(person)
          } else if (person.roleID == 3) {
            actors.push(person)
          } else if (person.roleID == 4) {
            others.push(person)
          }
        }
        if (directors.length == 0) {
          this.videoDetails.directorList.list = [{ id: 0, name: '暂无' }]
        } else {
          this.videoDetails.directorList.list = directors
        }
        if (actors.length == 0) {
          this.videoDetails.actorList.list = [{ id: 0, name: '暂无' }]
        } else {
          this.videoDetails.actorList.list = actors
        }
        if (authors.length == 0) {
          this.videoDetails.authorList.list = [{ id: 0, name: '暂无' }]
        } else {
          this.videoDetails.authorList.list = authors
        }

        if (others.length == 0) {
          this.videoDetails.otherList.list = [{ id: 0, name: '暂无' }]
        } else {
          this.videoDetails.otherList.list = others
        }
      })
    },
    initMediaInfo(videoID) {
      this.getVideoMediaInfo({ videoID }).then((response) => {
        this.mediaInfo = response.data
        console.log(this.mediaInfo)
        //计算视频长度
        var duration = response.data.duration
        if (duration > 86400) {
          this.mediaInfo.durationStr = '一天以上'
        } else {
          var hour = parseInt(duration / 3600)
          var min = parseInt((duration % 3600) / 60)
          var sec = parseInt(duration % 60)
          if (hour == 0) {
            if (min == 0) {
              this.mediaInfo.durationStr = sec + '秒'
            } else {
              this.mediaInfo.durationStr = min + '分' + sec + '秒'
            }
          } else {
            this.mediaInfo.durationStr = hour + '时' + min + '分' + sec + '秒'
          }
        }
      })
    },
    changeFollowed() {
      var videoID = { videoID: this.videoDetails.videoID }
      this.changeFollowedState(videoID).then((response) => {
        this.refresh()
      })
    },
    openFile(path) {
      shell.openPath(path)
    }
  }
}
</script>

<style >
/* 在暂停时显示播放按钮 */
.vjs-paused .vjs-big-play-button,
.vjs-paused.vjs-has-started .vjs-big-play-button {
  display: block;
}
/** 显示播放时间与总时长，隐藏剩余时间 */
.video-js .vjs-time-control {
  display: block;
}
.video-js .vjs-remaining-time {
  display: none;
}
/* 中间的播放箭头 */
.vjs-big-play-button .vjs-icon-placeholder {
  font-size: 1.55em;
}

/** 固定视频播放器按16：9的比例显示 */
.video-player {
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
}

.videoTitle {
  font-weight: bold;
  margin-bottom: 15px;
}

.mainpic {
  aspect-ratio: 57/84;
  margin-left: 15px;
  margin-right: 5px;
  border-radius: 25px;
}

.playButton {
  background: -webkit-gradient(linear, 100% 0%, 0% 0%, from(#e70920), to(#ff711e));
}

.videoInfoCard {
  margin-bottom: 40px;
  border-radius: 12px;
}

body {
  background-color: #f6f7f9;
}

.mainPage {
  margin: 20px;
}

.tableItem {
  margin-bottom: 7px;
}

.videoRateCard {
  border-radius: 35px;
  text-align: center;
  margin-left: 5px;
  background: -webkit-gradient(linear, 100% 0%, 0% 0%, from(#ec6f20), to(#e05642));
}
</style>