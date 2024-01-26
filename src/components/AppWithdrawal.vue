<script>
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";
export default {
  components: {},
  data() {
    return {
      token: ``,
      error: ``,
      status: '',
      id: "",
      cardNumber: "",
      amount: "",
    };
  },
  computed: {
    formatCardNumber() {
      return this.cardNumber ? this.cardNumber.match(/.{1,4}/g).join(" ") : "";
    },
  },
  methods: {
    async submit() {
      let response_balance = await axios.post(`/request_payments`, {
        userID: this.id
      })
      this.balance = response_balance.data.balance
      if (this.balance >= this.amount) {
        let response = await axios.post(`/request_payment`, {
          card_number: this.cardNumber,
          amount: this.amount,
          userID: this.id,
        });
        this.status = response.data.status
        this.error = response.data.message  
        if (this.status == '200') {
          setTimeout(() => {
            this.status = ''
            this.status = ''
            this.$router.push({ name: 'profile' })
          }, 30000)
        }
      } else {
        this.status = 400
        this.error = 'Сумма вывода превышает ваш баланс!'
      }
    },
    start() {
      this.id = this.getCookieValue("id");
    },

    updateValue(e) {
      let input = e.target.value.replace(/ /g, "");
      if (input.length > 16) {
        input = input.slice(0, 16);
      }
      this.cardNumber = input;
      e.target.value = this.formatCardNumber;
    },

    getCookieValue(name) {
      const cookies = document.cookie.split("; ");
      let res;
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        if (cookie.slice(0, 2) == name) {
          res = cookie.replace(name + "=", "");
        }
      }
      return res;
    },
  },
  mounted() {
    this.start();
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="form-box">
      <form ref="form" @submit.prevent="submit">
        <h2 class="title">Вывод средств</h2>
        <div class="input-box">
          <input
            :value="formatCardNumber"
            @input="updateValue($event)"
            name="card_number"
            type="text"
            class="card_number"
            required
          />
          <label for="">Номер карты</label>
        </div>
        <div class="input-box">
          <input
            v-model="amount"
            name="amount"
            type="text"
            class="amount"
            required
          />
          <label for="">Сумма</label>
        </div>
        <div class="sign-up">
          <button type="submit" class="sign-up-btn">Вывести</button>
        </div>
      </form>
    </div>
    <div v-if="error" class="notification-container">
      <div :class="{ error: status == 400, success: status == 200 }">
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-weight: 550;
}
 .notification-container {
  position: fixed;
  bottom: 3%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
 }
 
.success {
  background-color: #87E752;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
}
.error {
  background-color: #ED1C24;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
  font-weight: 550;
}
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.form-box {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d5d5d5;
  border: 1px solid #d5d5d5;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0px 0 10px 0 #ffffff71;
  flex-basis: 300px;
}

form {
  width: 100%;
}

a {
  color: #d5d5d5 !important;
  text-decoration: none;
}
.input-box {
  position: relative;
  margin: 25px 0;
  width: 100%;
  border-bottom: 2px solid #b3b3b3bc;
}

.input-box input {
  position: relative;
  width: 100%;
  height: 50px;
  background: transparent;
  border: none;
  border-radius: 10px;
  outline: none;
  font-size: 16px;
  padding: 0 35px 0 5px;
  color: #fff;
}

input:focus ~ label,
input[type="email"]:focus ~ label,
input:valid ~ label {
  top: -10px;
}

.input-box label {
  /* color: #fff; */
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s;
}

.title {
  text-align: center;
}

.sign-up {
  display: flex;
  justify-content: center;
  align-items: center;
}

.node {
  color: black;
}

.sign-up-btn {
  background-color: transparent;
  border: 1px solid #d5d5d5;
  color: #d5d5d5;
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 5px 7px;
}

@media (max-height: 780px) {

  .input-box input {
    height: 30px;
  }

  input:focus ~ label,
  input[type="email"]:focus ~ label,
  input:valid ~ label {
    top: -7px;
  }
}
</style>
