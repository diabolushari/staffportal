<?php

namespace App\Services\utils;

use Google\Protobuf\ListValue;
use Google\Protobuf\Struct;
use Google\Protobuf\Value;

class ArrayToStructConverter
{
    public static function convert(array $array): Struct
    {
        $struct = new Struct;
        foreach ($array as $key => $value) {
            $struct->getFields()[$key] = self::phpValueToProtoValue($value);
        }

        return $struct;
    }

    private static function phpValueToProtoValue(mixed $value): Value
    {
        $protoValue = new Value;

        if (is_array($value)) {
            // Check if associative array (object) or indexed array (list)
            $isAssoc = array_keys($value) !== range(0, count($value) - 1);

            if ($isAssoc) {
                // Convert nested associative array → Struct
                $struct = self::convert($value);
                $protoValue->setStructValue($struct);
            } else {
                // Convert numeric array → ListValue
                $list = new ListValue;
                foreach ($value as $v) {
                    // ✅ FIX: use `addValues()` → actually method is `getValues()` + `[] =`
                    $list->getValues()[] = self::phpValueToProtoValue($v);
                }
                $protoValue->setListValue($list);
            }
        } elseif (is_bool($value)) {
            $protoValue->setBoolValue($value);
        } elseif (is_numeric($value)) {
            $protoValue->setNumberValue(floatval($value));
        } elseif (is_null($value)) {
            $protoValue->setNullValue(0); // NullValue enum (0 = NULL)
        } else {
            $protoValue->setStringValue((string) $value);
        }

        return $protoValue;
    }
}
