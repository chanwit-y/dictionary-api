import { assertEquals } from "jsr:@std/assert";
import { transform } from "../libs/utils/common/transform.ts";

Deno.test("transform", () => {
  const input = `- แปลเป็นภาษาไทย: บรรพบุรุษ, สิ่งที่มาก่อน\n- คำอ่านในภาษาอังกฤษ: แอน-ติ-ซี-เดนท์\n- ประเภทของคำ: คำนาม (Noun)\n- ตัวอย่างประโยคในภาษาอังกฤษ: In grammar, the noun "dog" is the antecedent of the pronoun "it" in the sentence "The dog chased its tail."`;
  const result = transform(input);
  console.log("result", result);
  assertEquals(result, {
    thai: "บรรพบุรุษ, สิ่งที่มาก่อน",
    english: "แอน-ติ-ซี-เดนท์",
    type: "คำนาม (Noun)",
    example:
      'In grammar, the noun "dog" is the antecedent of the pronoun "it" in the sentence "The dog chased its tail."',
    remark: "",
  });
});
