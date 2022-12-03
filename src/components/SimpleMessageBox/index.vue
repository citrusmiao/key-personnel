<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div class="tc">{{ content }}</div>
    <span slot="footer">
      <el-button
        ref="confirm"
        type="primary"
        size="small"
        @click="
          disabled = true;
          confirm();
        "
        >{{ confirmButtonText }}</el-button
      >
      <el-button size="small" @click="cancel()">{{
        cancelButtonText
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: "提示",
      content: "",
      confirmButtonText: "确 定",
      cancelButtonText: "取 消",
      dialogVisible: false,
      promise: undefined,
    };
  },
  methods: {
    show(content, title, options) {
      const dialog = this;
      this.promise = new Promise(function (resolve, reject) {
        dialog.content = content;
        if (title !== undefined && title !== null) {
          dialog.title = title;
        } else {
          dialog.title = "提示";
        }
        if (options !== undefined && options !== null) {
          if (
            options.confirmButtonText !== undefined &&
            options.confirmButtonText !== null
          ) {
            dialog.confirmButtonText = options.confirmButtonText;
          } else {
            dialog.confirmButtonText = "确 定";
          }
          if (
            options.cancelButtonText !== undefined &&
            options.cancelButtonText !== null
          ) {
            dialog.cancelButtonText = options.cancelButtonText;
          } else {
            dialog.cancelButtonText = "取 消";
          }
        }
        dialog.dialogVisible = true;
        dialog.confirm = function () {
          this.dialogVisible = false;
          resolve();
        };
        dialog.cancel = function () {
          this.dialogVisible = false;
          reject();
        };
      });
      return this.promise;
    },
    cancel() {},
    confirm() {},
  },
};
</script>
