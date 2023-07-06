import Vue from "vue";
import Vuex from "vuex";
import { ethers } from "ethers";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ethereumProvider: {},
    account: "",
    net: 0,
  },
  mutations: {
    SETWEBPROVIDER: (state, provider) => {
      state.ethereumProvider = provider;
    },
    SETACCOUNTS: (state, account) => {
      state.account = account;
    },

    SETNET: (state, net) => {
      state.net = net;
    },
  },
  actions: {
    async setWebProvider({ commit }) {
      let web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          // 请求用户授权
          const results = await web3Provider.enable();
          if (!results.length) return;
          const provider = new ethers.providers.Web3Provider(web3Provider);
          const network = await provider.getNetwork();
          const accounts = await provider.listAccounts();
          commit("SETNET", network);
          commit("SETACCOUNTS", accounts[0]); // 获取账号
          commit("SETWEBPROVIDER", provider);

          web3Provider.on("chainChanged", async (networkId) => {
            commit("SETNET", networkId);
          });
          web3Provider.on("accountsChanged", async (accounts) => {
            commit("SETACCOUNTS", accounts[0]);
          });
        } catch (error) {
          if (error.code === 4001) {
            // 用户拒绝授权
            console.log("User denied account access.(用户拒绝授权)");
          } else if (error.code === -32002) {
            console.log("有授权请求未处理");
          } else {
            console.log(error);
          }
        }
      }
    },
  },
  modules: {},
});
