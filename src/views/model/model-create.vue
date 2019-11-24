<template>
  <div>
    <a-form :form="form">
      <!-- <a-form-item label="日期" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-date-picker 
          v-decorator="['date']"
        ></a-date-picker>
      </a-form-item> -->
      <a-form-item label='模型名称' :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-input
          v-decorator="[
            'modelName',
            {
              rules: [{ required: true, message: '输入模型名称' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="模型描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-textarea
          v-decorator="[
            'modelDescription',
            {
                rules: [{ required: true, message: '输入模型描述' }],
            }
          ]"
          placeholder="模型描述"
          :autosize="{ minRows: 4, maxRows: 16 }"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24, offset: 20 }">
        <a-button type="primary" @click="createNewModel()">
          新建
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {
  createNewModel,
  getModel,
} from '../../api/replay.js'
// import moment from 'moment';
export default {
  name: 'model-create',
  data() {
    return {
      isNew: true,
      form: this.$form.createForm(this, { name: 'form' }),
      modelDetail: {},
    }
  },
  mounted() {
    this.form.setFieldsValue({
      modelName: '',
      modelDescription: '',
    });
    if (this.$route.params.id) {
      this.getModelDetail()
      this.isNew = false
    }
  },
  methods: {
    createNewModel() {
      this.form.validateFields(async (err) => {
        if (!err) {
          let post;
          if (this.isNew) {
            post = this.form.getFieldsValue()
          } else {
            post = {
              id: this.modelDetail.id,
              ...this.form.getFieldsValue()
            }
          }
          const res = await createNewModel(post);
          if (res) {
            this.$notification.success({
              message: '成功',
              description: '创建成功',
            });
            this.$router.push('/model/list')
          }
        }
      })
    },
    async getModelDetail() {
      const val = await getModel(this.$route.params.id)
      this.modelDetail = val
      this.form.setFieldsValue({
        modelName: this.modelDetail.modelName,
        modelDescription: this.modelDetail.modelDescription
      })
    }
  }
}
</script>
