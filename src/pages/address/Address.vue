<template>
  <div class="address">
    <h2>顾客管理</h2>
		<!-- 按钮 -->
		<div class="address_header">
			<el-button @click="toAddHandler" type="primary" size="small">添加</el-button>
			<el-button type="danger" size="small"  @click="batchDeleteHandler">批量删除</el-button>
             <el-select   v-model="customers.id" clearable @change="dataFilter(customers.id)" placeholder="请选择顾客编号" >
            <el-option v-for="item in customers" :label="item.id" :value="item.id" :key = "item.c"></el-option>
		      </el-select>
		   
		</div>
		<!-- 表单 -->
    <el-dialog :title="title" :visible="visible" @close="dialogCloseHandler">
      <el-form :model="form" :rules="rules" ref="addressForm">
        <el-form-item label="省份" label-width="80px" prop="province">
          <el-input v-model="form.province" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" label-width="80px" prop="city">
          <el-input v-model="form.city" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="区域" label-width="80px" prop="area">
          <el-input v-model="form.area" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="80px" prop="address">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="80px" prop="telephone">
          <el-input v-model="form.telephone" autocomplete="off"></el-input>
        </el-form-item>
       <el-form-item label="顾客ID" label-width="80px">
		      <el-select  v-model="form.customerId" placeholder="请选择顾客编号">
		        <el-option v-for="item in customers" :label="item.realname" :value="item.id" :key = "item.realname"></el-option>
		      </el-select>
		    </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal" size="small">取 消</el-button>
        <el-button type="primary" @click="submitHandler" size="small">确 定</el-button>
      </div>
    </el-dialog>
		<!-- 表格 -->
    <el-table :data="addresses" size="small" @selection-change="idsChangeHandler">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="province" label="省份"></el-table-column>
      <el-table-column prop="city" label="城市"></el-table-column>
      <el-table-column prop="area" label="区域"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="telephone" label="电话"></el-table-column>
      <el-table-column prop="customerId" label="顾客编号"></el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template #default="record">
          <a href="" class="el-icon-delete" @click.prevent = "deleteHandler(record.row.id)"></a> &nbsp;
          <a href="" class="el-icon-edit-outline" @click.prevent = "editHandler(record.row)"></a>
          <a href=""  @click.prevent = "toDetails(record.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
		<el-pagination
		@current-change="pagechangeHandler"
		 layout="prev, pager, next"
		:current-page="params.page+1" :page-size="addressPage.pageSize" :total="addressPage.total">

  		</el-pagination>
  		<!-- /分页 -->

  </div>
</template>
<script>
import{mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import address from '../../store/modules/address';
export default {
  data() {
    return {
      ids: [],
      form: {},
     
      rules: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        telephone:[
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },
   computed: {
    ...mapState("address",["params","addresses","visible","title","customers","addressPage"]),
    ...mapGetters("address",["countaddresses","addressesIdFilter"])
    // 普通属性
   

  },
  created() {
    this.findAllPages();
    this.loadCustomerData();
  },
 
  methods: {
    ...mapActions("address",["findAllPages","findAllAddresses","deleteAddressById","saveOrUpdateAddress","batchDeleteAddresses","loadCustomerData","findAddressById"]),
    ...mapMutations("address",["showModal","closeModal","setTitle"]),
    // 普通方法
    toDetails(address){
      // 跳转到顾客详情页面
      this.$router.push({
        path:'/addressDetail',
        query:{address},
        // params:{id:1}
      })
    },
    batchDeleteHandler() {
      this.batchDeleteAddresses(this.ids)
      .then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id);
    },
    dialogCloseHandler() {
      this.$refs.addressForm.clearValidate();
      this.closeModal();
    },
    toAddHandler() {
      this.form = {};
      this.setTitle("添加地址信息")
      this.showModal();
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.addressForm.validate((valid)=>{
        if(valid){
          // 2.提交表单
          this.saveOrUpdateAddress(this.form)
          .then((response)=>{
            this.$message({type:"success",message:response.statusText});
          })
        } else {
          return false;
        }
      });
      
    },
    deleteHandler(id) {
      let promise = this.deleteAddressById(id)
      promise.then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    editHandler(row) {
      this.form = row;
      this.setTitle("修改地址信息")
      this.showModal();
    },
    //根据顾客id查询地址信息
   dataFilter(id) {
      this.findAddressById(id);
    },
    pagechangeHandler(currentPage){
				this.params.page = currentPage-1;
				this.findAllPages();
			},
  }
}
</script>
<style scoped>

</style>