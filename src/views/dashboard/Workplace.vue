<template>
  <div>
    <!-- Picture viewer -->
    <a-drawer
      :title="projectDetailInfo.name"
      placement="bottom"
      closable
      height="100%"
      :visible="visible"
      @close="visible = false"
    >
    <img :key="i" v-for="(item, i) in projectDetailInfo.list" style="width: 100%; display: block; margin: 20px 0" :src="domain + item.result_image" />
    <!-- Data detail in table -->
    <!-- <a-table bordered :pagination="false" :columns="columns" :data-source="data" /> -->
  </a-drawer>

    <a-row :gutter="24">
      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card
          class="project-list"
          :loading="loading"
          :bordered="false"
          title="Analysis cases"
          :body-style="{ padding: 0 }"
        >
          <a slot="extra">
            <a-button type="primary" style="margin-right: 10px" @click="getProjects" :disabled="loading">Refresh</a-button>
            <a-upload
              name="file"
              :multiple="true"
              :showUploadList="false"
              :action="uploadUrl"
              :headers="headers"
              @change="handleChange"
            >
              <a-button>
                New analysis
              </a-button>
            </a-upload>
          </a>
          <div>
            <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projects">
              <a-spin :spinning="!item.uuid" :delay="500" @click="projectDetail(item)">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="description" class="card-description" style="margin: 10px auto; height: 230px; text-align: center;">
                      <img v-if="item.results" :src="domain + item.results[0].result_image" style="height: 100%; background-color: rgba(0,0,0,0.1);" @load="imgResult" >
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <span class="datetime">{{ item.uuid }}</span>
                  </div>
                </a-card>
              </a-spin>
            </a-card-grid>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { Radar } from '@/components'
import { message } from 'ant-design-vue'
import { getPredictResult } from '@/api/manage'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'

export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper,
    Radar
  },
  data () {
    return {
      loading: true,
      timeFix: timeFix(),
      visible: false,
      avatar: '',
      user: {},
      projects: [],
      uploadUrl: '/analysis',
      headers: {
        'Authorization': storage.get(ACCESS_TOKEN),
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
      projectDetailInfo: {
        img: ''
      },
      domain: 'https://potholes-engine.taheralkamel.com',
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          slots: { customRender: 'name' }
        },
        {
          title: 'Probability (%)',
          dataIndex: 'percentage_probability',
          key: 'percentage_probability'
        }
      ],
      data: []
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.user.nickname,
      welcome: state => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted () {
    this.getProjects()
  },
  methods: {
    imgResult (item) {
      item.loaded = true
    },
    projectDetail (item) {
      if (item.results) {
        this.visible = true
        this.projectDetailInfo.list = [...item.results]
        this.projectDetailInfo.name = item.uuid
        this.data = item.results.detections
      }
    },
    getProjects () {
      this.loading = true
      this.$http.get('/list/search/projects').then(() => {
        getPredictResult().then(res => {
          if (Array.isArray(res)) {
            this.projects = res
          }
          this.loading = false
        })
      })
    },
    handleChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
        this.getProjects()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './Workplace.less';

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
