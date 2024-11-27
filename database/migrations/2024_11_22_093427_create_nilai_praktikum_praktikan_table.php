<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nilai_praktikum_praktikan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('praktikum_id')->constrained('praktikum')->cascadeOnDelete();
            $table->foreignUuid('praktikan_id')->constrained('praktikan')->cascadeOnDelete();
            $table->string('nilai')->comment('JSON Nilai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_praktikum_praktikan');
    }
};
