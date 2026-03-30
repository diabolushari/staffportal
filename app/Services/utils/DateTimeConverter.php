<?php

namespace App\Services\utils;

use Google\Protobuf\Timestamp;

class DateTimeConverter
{
    public static function convertStringToTimestamp(?string $date): ?Timestamp
    {
        $timestamp = new Timestamp;
        if ($date === null) {
            return null;
        }

        if ($date != null) {
            $seconds = strtotime($date);
            if ($seconds !== false) {
                // strtotime() succeeded — set the value
                $timestamp->setSeconds($seconds);
            }
        }

        return $timestamp;
    }

    public static function convertTimestampToString(?Timestamp $timestamp): string
    {
        if ($timestamp === null) {
            return '';
        }

        $seconds = $timestamp->getSeconds();
        if (! is_int($seconds) || $seconds <= 0) {
            return '';
        }

        return date('Y-m-d H:i:s', $seconds);
    }

    public static function converTimeStampToDate(?TimeStamp $timestamp): string
    {
        if ($timestamp === null) {
            return '';
        }



        return date('Y-m-d');
    }
}
