export const transform = (content: string) => {
  return content.split("\n").reduce(
    (p, c) => {
      //     console.log("p", p);
      //     console.log("c", c.split(":"));
      const [k, v] = c.split(":");
      return { ...p, [key(k)]: (v ?? "").trim() };
    },
    {
      thai: "",
      english: "",
      type: "",
      example: "",
      remark: "",
    }
  );
};

const key = (k: string) => {
  switch (k.replace("-", "").trim()) {
    case "แปลเป็นภาษาไทย":
      return "thai";
    case "คำอ่านในภาษาอังกฤษ":
      return "english";
    case "ประเภทของคำ":
      return "type";
    case "ตัวอย่างประโยคในภาษาอังกฤษ":
      return "example";
    default:
      return "remark";
  }
};
