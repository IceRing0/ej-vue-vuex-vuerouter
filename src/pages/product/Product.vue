<template>
  <div id="product">
      <h2>产品管理</h2>
    <!-- 按钮 -->
    <div class="btns">
      <el-row>
				<!-- 左侧搜索 -->
        <!-- {{params}} -->
				<el-col :span="12">
					<el-form :inline="true" v-model="params" @keyup.native="loadData">
						<el-form-item>
							<el-input v-model="params.name" placeholder="请输入产品名称" ></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="params.description" placeholder="请输入产品描述" ></el-input>
						</el-form-item>
            <el-form-item>
							<el-input v-model="params.price" placeholder="请输入产品价格" ></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="params.status" placeholder="请输入产品状态" ></el-input>
						</el-form-item>
					</el-form>
				</el-col>
        <!-- 返回 -->
        <el-col :span="8">
          <el-button @click.prevent="returnHandler" type="success" size="small" plain>返回</el-button>
        </el-col>
				<!-- /左侧搜索 -->
				<!-- 右侧添加与批量删除 -->
				<el-col :span="4" style="text-align:right;">
					<el-button @click.prevent="toAddHandler" type="primary" size="small" plain>添加</el-button>
          <el-button @click.prevent="batchDeleteHandler" type="danger" size="small" plain>批量删除</el-button>
				</el-col>
				<!-- /右侧添加与批量删除 -->
			</el-row>
    </div>
    <!-- 模态框 -->
    <el-dialog @close="dialogCloseHandler" :title="title" :visible.sync="visible" width="30%">
      <el-form :model="form" :rules="rules" ref="productForm">
        <el-form-item label="产品名称" label-width="100px" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品描述" label-width="100px" prop="description">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品价格" label-width="100px" prop="price">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属栏目" label-width="100px" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择所属栏目">
		        <el-option v-for="item in categories" :label="item.name" :value="item.id" :key="item.id"></el-option>
		      </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="status">
          <el-select v-model="form.status" placeholder="请选择产品状态">
            <el-option label="有货" value="有货"></el-option>
            <el-option label="无货" value="无货"></el-option>
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
    <el-table :data="products.list" @selection-change="idsChangeHandler">
      <el-table-column prop="id" label="产品编号" align="center" width="50" type="selection"></el-table-column>
      <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="description" label="产品描述" align="center"></el-table-column>
      <el-table-column prop="price" label="产品价格" align="center"></el-table-column>
      <el-table-column prop="photo" label="栏目图标"  align="center">
				<template v-slot:default="record">
					<img :src="record.row.category.icon" alt="">
				</template>
			</el-table-column>
      <el-table-column prop="category.name" label="所属栏目" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
	      <template #default="record">
	        <el-button @click.prevent = "deleteHandler(record.row.id)" type="danger" size="small" icon="el-icon-delete" plain circle></el-button>
	        <el-button @click.prevent = "editHandler(record.row)" type="success" size="small" icon="el-icon-edit" plain circle></el-button>
          <el-button @click.prevent = "toDetailsHandler(record.row)" type="primary" size="small" icon="el-icon-tickets" plain circle></el-button>
	      </template>
	    </el-table-column>
    </el-table>
    <!-- 分页 -->
		<div style="text-align:center">
			<el-pagination
			  background
			  @current-change="pageChangeHandler"
			  layout="prev, pager, next"
        :current-page="products.page+1"
			  :page-size="products.pageSize"
			  :total="products.total">
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
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入产品描述', trigger: 'blur' },
          { min: 2, max: 99, message: '长度在 2 到 99 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入产品价格', trigger: 'blur' },
          { min: 1, max: 11, message: '长度至少一位的字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请输入所属栏目', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ]
      },
      params:{
        page:0,
        pageSize:5,
        name:'',
        description:'',
        price:'',
        status:''
      }
    }
  },
  created(){
    this.loadData();
    this.findAllCategories();
  },
  computed:{
    ...mapState("product",["products","visible","title"]),
    ...mapState("category",["categories"]),
    ...mapGetters("product",["countProducts","productStatusFilter"])
    // 普通属性
  },
  methods:{
    ...mapActions("product",["findAllProducts","deleteProductById","saveOrUpdateProduct","batchDeleteProducts"]),
    ...mapActions("category",["findAllCategories"]),
    ...mapMutations("product",["showModal","closeModal","setTitle","pageChangeHandler"]),
    // 普通方法

    // 跳转到产品详情页面
    toDetailsHandler(product){
      this.$router.push({
        name:'productDetails',
        query:{product}
      })
    },

    //返回
    returnHandler(){
      this.params.name = '',
      this.params.description = '',
      this.params.price = '',
      this.params.status = '',
      this.loadData();
    },
    //分页查询
    loadData(){
      this.findAllProducts(this.params);
    },
    //换页
    pageChangeHandler(currentPage){
      this.params.page = currentPage-1;
      //刷新页面
      this.findAllProducts(this.params);
    },
    //批量删除
    batchDeleteHandler(){
      this.batchDeleteProducts(this.ids)
      .then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    //为全选绑定事件
    idsChangeHandler(val){
      this.ids = val.map((item)=>{
        return item.id;
      })
      // 简写形式
      // this.ids = val.map(item => item.id);
    },
    dialogCloseHandler(){
      this.$refs.productForm.clearValidate();
      this.closeModal();
    },
    //为添加按钮绑定事件
    toAddHandler(){
      this.form = {};
      this.setTitle("添加产品信息");
      this.showModal();
    },
    //为提交按钮绑定事件
    submitHandler(){
      this.$refs.productForm.validate((vaild)=>{
        if(vaild){
          //提交表单
          this.saveOrUpdateProduct(this.form)
          .then((response)=>{
            console.log(response.data);
            this.$message({type:"success",message:response.statusText});
          })
        } else {
          return false;
        }
      })
    },
    //通过ID删除
    deleteHandler(id){
      let promise = this.deleteProductById(id);
      promise.then((response)=>{
        this.$message({type:"success",message:response.statusText});
      })
    },
    //为修改按钮绑定事件
    editHandler(row){
      this.form = row;
      this.setTitle("修改产品信息");
      this.showModal();
    }
  }
}
</script>

<style scoped>

</style>  