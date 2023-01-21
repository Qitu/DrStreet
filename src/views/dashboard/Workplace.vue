<template>
  <div>
    <a-card>
      <a-col :span="12">
        <a-statistic title="Total cases" :value="projects.length"/>
      </a-col>
    </a-card>
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
    <a-table bordered :pagination="false" :columns="columns" :data-source="data" />
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
            <a-button type="primary" @click="getProjects" :disabled="loading">Refresh</a-button>
          </a>
          <div>
            <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projects">
              <a-spin :spinning="!item.uuid" :delay="500">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta @click="projectDetail(item)">
                    <div slot="description" class="card-description" style="margin: 10px auto 20px; height: 230px; text-align: center;">
                      <img v-if="item.results" :src="domain + item.results[0].result_image" style="height: 100%; background-color: rgba(0,0,0,0.1);" @load="imgResult" >
                    </div>
                  </a-card-meta>
                  <a-tag color="#108ee9">{{ item.status }}</a-tag>
                  <div style="margin-top: 15px">UUID: {{ item.uuid }}</div>
                  <div class="project-item">
                    <span class="datetime">Create: {{ new Date(item.created_at) }}</span>
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
import { getPredictResult, updatePredictStatus } from '@/api/manage'
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
      filterStatus: '',
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
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: 'Probability (%)',
          dataIndex: 'percentage_probability',
          key: 'percentage_probability'
        }
      ],
      dataStatus: [
        {
          id: 1,
          name: 'NEW'
        },
        {
          id: 2,
          name: 'PREDICTED'
        },
        {
          id: 3,
          name: 'REVIEWED'
        },
        {
          id: 4,
          name: 'NO_POTHOLES'
        },
        {
          id: 5,
          name: 'NFAILEDEW'
        },
        {
          id: 6,
          name: 'FAILED'
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
    updateStatus (val, item) {
      updatePredictStatus(item).then(res => {
      })
    },
    projectDetail (item) {
      if (item.results) {
        this.visible = true
        this.projectDetailInfo.list = [...item.results]
        this.projectDetailInfo.name = item.uuid
        try {
          item.results[0].detections.forEach((detection, i) => {
            detection.id = detection.name + (i + 1)
          })
          this.data = item.results[0].detections
        } catch (e) {}
      }
    },
    getProjects ($event = null) {
      this.loading = true
      getPredictResult().then(res => {
        if (Array.isArray(res)) {
          this.projects = res
        }
        this.loading = false
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
