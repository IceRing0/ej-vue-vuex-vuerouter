<template>
  <div class="comment">
    <h2>评论管理</h2>
      <!-- 按钮 -->
      <div class="btns">
        <el-button @click="toAddHandler" type="primary" size="small">添加</el-button>
        <el-button @click="batchDeleteHandler" type="danger" size="small">批量删除</el-button>
      </div>
      <!-- /按钮 -->
    
    <!-- {{comments}} -->
   
    <!-- 表格 -->
    <el-table :data="comments" size="small" @selection-change="idsChangeHandler">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="commentTime" label="评论时间"></el-table-column>
      <el-table-column prop="orderId" label="订单id"></el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template #default="record">
          <a href="" class="el-icon-delete" @click.prevent = "deleteHandler(record.row.id)"></a> &nbsp;
          <a href="" class="el-icon-edit-outline" @click.prevent = "editHandler(record.row)"></a>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <!-- {{form}} -->
      <el-form :model="form" :rules="rules" ref="commentForm">
        <el-form-item label="评论内容" label-width="100px" prop="content">
          <el-input v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="评论时间" label-width="100px" prop="commentTime">
          <el-input v-model="form.commentTime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属订单" label-width="100px" prop="orderId">
          <el-select v-model="form.orderId" placeholder="请选择活动区域">
            <el-option v-for="item in orders" :label="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal" size="small">取 消</el-button>
        <el-button type="primary" @click="submitHandler" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 分页 -->
    <!-- <el-pagination
    @current-change="pageChangeHandler"
      layout="prev, pager, next"
      :current-page="params.page+1"
      :page-size="comments.pageSize"
      :total="comments.total">
    </el-pagination> -->
    <!-- /分页 -->
  </div>
</template>
<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
  data(){
    return {
      ids:[],
      form:{},
      rules:{
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        commentTime:[
          { required: true, message: '请输入评论时间', trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.findAllComments();
    this.findAllOrders();
  },
  computed:{
    ...mapState("comment",["comments","orders","visible","title"]),
    ...mapGetters("comment",["countcomments","commentStatusFilter"])
    // 普通属性

  },
  methods:{
    ...mapActions("comment",["findAllComments","findAllOrders","deletecommentById","saveOrUpdatecomment","batchDeletecomments"]),
    ...mapMutations("comment",["showModal","closeModal","setTitle"]),
    // 普通方法
    toDetails(comment){
      // 跳转到评论详情页面
      this.$router.push({
        path:'/commentDetail',
        query:{comment},
        // params:{id:1}
      })
    },
    batchDeleteHandler(){
      this.batchDeletecomments(this.ids)
      .then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    idsChangeHandler(val){
      this.ids = val.map(item => item.id);
    },
    dialogCloseHandler(){
      this.$refs.commentForm.clearValidate();
    },
    toAddHandler(){
      this.form = {};
      this.setTitle("添加评论信息")
      this.showModal();
    },
    submitHandler(){
      // 1.表单验证
      this.$refs.commentForm.validate((valid)=>{
        if(valid){
          // 2.提交表单
          this.saveOrUpdatecomment(this.form)
          .then((response)=>{
            this.$message({type:"success",message:response.statusText});
          })
        } else {
          return false;
        }
      });
      
    },
    deleteHandler(id){
      let promise = this.deletecommentById(id)
      promise.then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    editHandler(row){
      this.form = row;
      this.setTitle("修改评论信息")
      this.showModal();
    }
  }
}
</script>
<style scoped>

</style>