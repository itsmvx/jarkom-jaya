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
        Schema::create('nilai', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('angka')->default(0);
            $table->foreignUuid('praktikan_id')->constrained('praktikan')->cascadeOnDelete();
            $table->foreignUuid('pertemuan_id')->constrained('pertemuan')->cascadeOnDelete();
            $table->foreignUuid('jenis_nilai_id')->constrained('jenis_nilai')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['praktikan_id', 'pertemuan_id', 'jenis_nilai_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai');
    }
};
