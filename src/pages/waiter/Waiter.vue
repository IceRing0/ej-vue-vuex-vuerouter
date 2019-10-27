<template>
  <div id="waiter">
      <h2>员工管理</h2>
    <!-- 按钮 -->
    <div class="btns">
      <el-button @click.prevent="toAddHandler" type="primary" size="small" plain>添加</el-button>
      <el-button @click.prevent="batchDeleteHandler" type="danger" size="small" plain>批量删除</el-button>
    </div>
    <!-- 模态框 -->
    <el-dialog @close="dialogCloseHandler" :title="title" :visible.sync="visible" width="30%">
      <el-form :model="form" :rules="rules" ref="waiterForm">
        <el-form-item label="姓名" label-width="100px" prop="realname">
          <el-input v-model="form.realname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="100px" prop="telephone">
          <el-input v-model="form.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="status">
          <el-select v-model="form.status" placeholder="请选择员工状态">
            <el-option label="正常" value="正常"></el-option>
            <el-option label="不正常" value="不正常"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <!-- {{ids}} -->
    <el-table :data="waiters.list" @selection-change="idsChangeHandler">
      <el-table-column prop="id" label="员工编号" align="center" width="50" type="selection"></el-table-column>
      <el-table-column prop="realname" label="姓名" align="center"></el-table-column>
      <el-table-column prop="password" label="密码" align="center"></el-table-column>
      <el-table-column prop="telephone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center"></el-table-column>
      <el-table-column prop="photo" label="照片" align="center"></el-table-column>
      <el-table-column prop="registerTime" label="注册时间" align="center"></el-table-column>
      <el-table-column prop="score" label="状态" align="center"></el-table-column>
      <el-table-column prop="orderQuantity" label="状态" align="center"></el-table-column>
      <el-table-column prop="idCard" label="身份证" align="center"></el-table-column>
      <el-table-column prop="idcardPhotoPositive" label="身份证正面" align="center"></el-table-column>
      <el-table-column prop="idcardPhotoNegative" label="身份证反面" align="center"></el-table-column>
      <el-table-column prop="bankCard" label="银行卡" align="center"></el-table-column>
      <el-table-column prop="bankCardPhoto" label="银行卡照片" align="center"></el-table-column>
      <el-table-column prop="addressId" label="地址编号" align="center"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="100">
	      <template #default="record">
	        <el-button @click.prevent = "deleteHandler(record.row.id)" type="danger" size="small" icon="el-icon-delete" plain circle></el-button>
	        <el-button @click.prevent = "editHandler(record.row)" type="success" size="small" icon="el-icon-edit" plain circle></el-button>
          <!-- <el-button @click.prevent = "toDetailsHandler(record.row)" type="primary" size="small" icon="el-icon-tickets" plain circle></el-button> -->
	      </template>
	    </el-table-column>
    </el-table>
    <!-- 分页 -->
		<div style="text-align:center">
			<el-pagination
			  background
			  @current-change="pageChangeHandler"
			  layout="prev, pager, next"
        :current-page="waiters.page+1"
			  :page-size="waiters.pageSize"
			  :total="waiters.total">
			</el-pagination>
		</div>
		<!-- /分页 -->
  </div>
</template>

<script>
import {mapActions,mapGetters,mapMutations,mapState} from 'vuex'
export default {
  // 一般双向数据绑定的值放于data中
  data(){
    return {
      ids:[],
      form:{},
      rules:{
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度 11 的字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ]
      },
      params:{
        page:0,
        pageSize:2,
        realname:'',
        telephone:'',
        status:''
      }
    }
  },
  created(){
    this.findAllWaiters(this.params);
  },
  computed:{
    ...mapState("waiter",["waiters","visible","title"]),
    ...mapGetters("waiter",["countWaiters","waiterStatusFilter"])
    // 普通属性
  },
  methods:{
    ...mapActions("waiter",["findAllWaiters","deleteWaiterById","saveOrUpdateWaiter","batchDeleteWaiters"]),
    ...mapMutations("waiter",["showModal","closeModal","setTitle","pageChangeHandler"]),
    // 普通方法

    // toDetailsHandler(waiter){
    //   // 跳转到员工详情页面
    //   this.$router.push({
    //     path:'/waiterDetail',
    //     query:{waiter}
    //     })
    // },
    //分页查询
    pageChangeHandler(currentPage){
      this.params.page = currentPage-1;

      // this.pageChangeHandler(params.page)
      // console.log(params.page);
      //刷新页面
      this.findAllWaiters(this.params);
    },
    batchDeleteHandler(){
      this.batchDeleteWaiters(this.ids)
      .then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    idsChangeHandler(val){
      this.ids = val.map((item)=>{
        return item.id;
      })
      // 简写形式
      // this.ids = val.map(item => item.id);
    },
    dialogCloseHandler(){
      this.$refs.waiterForm.clearValidate();
    },
    //为添加按钮绑定事件
    toAddHandler(){
      this.form = {};
      this.setTitle("添加员工信息");
      this.showModal();
    },
    submitHandler(){
      //表单验证
      this.$refs.waiterForm.validate((vaild)=>{
        if(vaild){
          //提交表单
          this.saveOrUpdateWaiter(this.form)
          .then((response)=>{
            // console.log(response.data);
            this.$message({type:"success",message:response.statusText});
          })
        } else {
          return false;
        }
      })
    },
    //通过ID删除
    deleteHandler(id){
      let promise = this.deleteWaiterById(id);
      promise.then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    //为修改按钮绑定事件
    editHandler(row){
      this.form = row;
      this.setTitle("修改员工信息");
      this.showModal();
    }
  }
}
</script>

<style scoped>

</style>  