<template>
  <div class="home">
    <div class="header-box">
      <div class="tit">众筹项目</div>
      <div class="wallet">
        <svg class="icon my-icon" aria-hidden="true">
          <use xlink:href="#icon-qianbao"></use>
        </svg>
        <div v-show="account" class="account">{{ account }}</div>
      </div>
    </div>
    <div class="content">
      <div>请切换到sepolia网络体验</div>
      <div class="balance">我的余额：{{ this.balance }} ETH</div>
      <el-button type="primary" @click="dialogFormVisible = true"
        >添加新众筹项目</el-button
      >
      <div class="tab-box">
        <el-tabs v-model="activeTab" @tab-click="handleTab">
          <el-tab-pane
            v-for="item in tabInfo"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          />
        </el-tabs>
        <div
          class="info-wrap"
          v-for="(item, index) in depositList"
          :key="index"
        >
          <div
            class="box-card"
            v-if="
              activeTab == 0 ||
              (activeTab == 1 && item.status == 2) ||
              (activeTab == 2 && item.status == 1) ||
              (activeTab == 3 && item.status == 0) ||
              (activeTab == 4 &&
                item.user.toLowerCase() == (account && account.toLowerCase()))
            "
          >
            <div slot="header">
              <span>众筹项目编号：{{ item.id }}</span>
            </div>
            <div class="detail">
              <div>
                项目状态：{{
                  item.status == 0
                    ? "停止众筹,已退款"
                    : item.status == 1
                    ? "正在众筹中"
                    : "众筹成功"
                }}
              </div>
              <div>众筹发起人：{{ item.user }}</div>
              <div>众筹收款人：{{ item.to }}</div>
              <div>当前众筹人数：{{ item.currentPeople }}</div>
              <div>
                当前众筹数量：{{ formatAmount(item.currentAmount) }} ETH
              </div>
              <div>众筹金额目标：{{ formatAmount(item.maxAmount) }} ETH</div>
              <div>众筹限制最大人数：{{ item.maxPeople }}</div>
              <div class="btn-wrap" v-if="item.status == 1">
                <el-button
                  class="pbtn mr10"
                  type="primary"
                  @click="contribution(item, item.id)"
                  >捐款</el-button
                >
                <div class="input-box mr10">
                  <el-input v-model="item.inputAmount" class="mr10"></el-input>
                  <!-- <el-button
                    class="pbtn pbtnmax"
                    type="primary"
                    @click="handlerMax(item, index)"
                    >MAX</el-button
                  > -->
                </div>
                <el-button
                  class="pbtn mr10"
                  type="primary"
                  v-if="
                    item.user.toLowerCase() ==
                    (account && account.toLowerCase())
                  "
                  @click="closeProject(item.id)"
                  >关闭众筹</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="项目" width="600px" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="发起人地址" :label-width="formLabelWidth">
          <el-input v-model="account" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收款人地址" :label-width="formLabelWidth">
          <el-input v-model="form.to"></el-input>
        </el-form-item>
        <el-form-item label="众筹目标金额" :label-width="formLabelWidth">
          <el-input v-model="form.maxAmount" autocomplete="off">
            <template slot="append">ETH</template>
          </el-input>
        </el-form-item>
        <el-form-item label="众筹限制最大人数" :label-width="formLabelWidth">
          <el-input v-model="form.maxPeople" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 0xd9813e58B487CfE0B4Ef728088298499cF2D689E
// @ is an alias to /src
import { rpcProvider, getContract } from "../utils/provider";
import { mapState } from "vuex";
import { ethers } from "ethers";
import {
  // formatAmount,
  parseAmount,
  // accMul,
  // accDiv,
  // toFixed,
  // accAdd,
  // accSub,
} from "@/utils/format.js";

export default {
  name: "HomeView",
  data() {
    return {
      activeTab: "0",
      accountInfo: {},
      depositList: [],
      dialogFormVisible: false,
      formLabelWidth: "130px",
      balance: 0,
      form: {
        to: "",
        maxAmount: "",
        maxPeople: "",
      },
      tabInfo: [
        { label: "全部众筹", name: "0" },
        { label: "众筹完成", name: "1" },
        { label: "众筹中", name: "2" },
        { label: "众筹失败", name: "3" },
        { label: "我的众筹项目", name: "4" },
      ],
    };
  },
  computed: {
    ...mapState(["ethereumProvider", "account"]),
  },

  created() {
    this.getBalance();
    this.getProjects();
  },
  watch: {
    async account() {
      this.getBalance();
    },
  },
  methods: {
    handleTab(tab) {
      this.activeTab = tab.index;
    },
    formatAmount(num) {
      return ethers.utils.formatEther(num);
    },
    async getBalance() {
      if (!this.account) return;
      const num = await rpcProvider.getBalance(this.account);
      this.balance = ethers.utils.formatEther(num);
    },
    async getProjects() {
      const contract = getContract();
      const length = await contract.projectLength();
      let arr = [];
      for (let i = 0; i < length; i++) {
        arr.unshift(contract.projects(i));
      }
      let depositList = await Promise.all(arr);
      this.depositList = depositList.map((item) => {
        return { ...item, inputAmount: "" };
      });
      console.log(this.depositList, "project");
    },

    async closeProject(index) {
      const myContract = getContract(this.ethereumProvider);
      try {
        const tx = await myContract.closeProject(index);
        this.$notify({
          title: "关闭中，请稍后...",
          type: "success",
        });
        await tx.wait();
        this.$notify({
          title: "关闭成功",
          type: "success",
        });
        this.getBalance();
        this.getProjects();
      } catch (error) {
        this.$notify.error({
          title: "关闭失败",
        });
        console.error(error);
      }
    },

    // 捐款
    async contribution(item, index) {
      const myContract = getContract(this.ethereumProvider);
      const amount = parseAmount(item.inputAmount);
      try {
        const tx = await myContract.contribution(index, {
          value: amount,
        });
        console.log(tx, "txtxtxtxt");
        this.$notify({
          title: "捐款中，请稍后...",
          type: "success",
        });
        await tx.wait();
        this.$notify({
          title: "捐款成功",
          type: "success",
        });
        this.getBalance();
        this.getProjects();
      } catch (error) {
        this.$notify.error({
          title: "捐款失败",
        });
        console.error(error);
      }
    },
    // handlerMax(item, index) {
    //   item.inputAmount = this.balance;
    //   this.depositList.splice(index, 1, item);
    // },

    // 新建众筹项目
    async confirm() {
      const myContract = getContract(this.ethereumProvider);
      console.log(myContract, "kokokokok");
      let { to, maxAmount, maxPeople } = this.form;
      maxAmount = parseAmount(maxAmount);
      try {
        const tx = await myContract.add(to, maxAmount, maxPeople);
        this.$notify({
          title: "添加中，请稍后...",
          type: "success",
        });
        this.dialogFormVisible = false;
        await tx.wait();
        this.$notify({
          title: "添加成功",
          type: "success",
        });
        this.getProjects();
        this.getBalance();
      } catch (error) {
        this.$notify.error({
          title: "添加失败",
        });
        console.error(error);
      }
    },
    // formatAmount,
  },
};
</script>

<style lang="less" scoped>
.home {
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tit {
      font-size: 36px;
      font-weight: bold;
    }
    .wallet {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .account {
      width: auto;
      background-color: #409eff;
      padding: 6px;
      border-radius: 10px;
      color: #fff;
    }
  }
  .content {
    position: relative;
    margin: 0 auto;
  }
  .tab-box {
    width: 50%;
    margin: 20px auto 0;
  }
  .balance {
    margin: 20px 0;
  }
  .my-icon {
    font-size: 36px;
  }
  .info-wrap {
    margin: 0 auto;
  }
  .box-card {
    width: 100%;
    margin: 20px 0;
    padding: 20px;
    border: 1px solid black;
    border-radius: 10px;
  }
  .detail {
    text-align: left;
    .row {
      margin: 6px 0;
    }
  }
  .btn-wrap {
    display: flex;
    margin-top: 20px;
    .input-box {
      display: flex;
      align-items: center;
      margin: 0 10px;
    }
  }
}
</style>
